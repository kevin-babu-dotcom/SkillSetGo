'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import axios from 'axios'
import { auth } from '@/firebase/config'
import { getUserProfile, updateUserProfile, updateUserProfilePhoto } from '@/firebase/firestore'
import { updateUserFirebaseProfile, updateUserEmail, setupRecaptcha, sendPhoneOtp } from '@/firebase/auth'
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { PhoneAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth'
import {
  User,
  CreditCard,
  Camera,
  MapPin,
  GraduationCap,
  Phone,
  Mail,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Building,
  ShieldCheck,
  Edit2,
  X
} from 'lucide-react'

export default function StudentProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('personal')
  const [saving, setSaving] = useState(false)
  
  const fileInputRef = useRef(null)
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  // Edit Mode state
  const [isEditingProfile, setIsEditingProfile] = useState(false)

  // Personal info form state
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    city: '',
    class: '',
    school: '',
  })

  // Password change state
  const [passwordFlowStep, setPasswordFlowStep] = useState(1); 
  const [verificationMethod, setVerificationMethod] = useState('phone'); 
  const [verificationOtp, setVerificationOtp] = useState(['', '', '', '', '', '']);
  const [otpConfirmationResult, setOtpConfirmationResult] = useState(null);
  
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const recaptchaVerifierRef = useRef(null);
  const otpInputRefs = useRef([]);

  // Email Security Gateway state
  const [showEmailVerifyModal, setShowEmailVerifyModal] = useState(false);
  const [emailVerifyMethod, setEmailVerifyMethod] = useState('phone');
  const [emailOtpStep, setEmailOtpStep] = useState(1);
  const [emailOtpCode, setEmailOtpCode] = useState(['', '', '', '', '', '']);
  const [emailConfirmationResult, setEmailConfirmationResult] = useState(null);
  const emailOtpInputRefs = useRef([]);

  // Fetch user data on mount
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (!currentUser) {
        router.push('/login')
        return
      }
      setUser(currentUser)
      try {
        const userProfile = await getUserProfile(currentUser.uid)
        setProfile(userProfile)
        
        if (userProfile) {
          setFormData({
            fullName: userProfile.fullName || '',
            email: userProfile.email || currentUser.email || '',
            phone: userProfile.phone || '',
            city: userProfile.city || '',
            class: userProfile.class || '',
            school: userProfile.school || '',
          })
        }
      } catch (error) {
        console.error('Error fetching profile:', error)
        setErrorMessage('Failed to load profile data.')
      } finally {
        setLoading(false)
      }
    })
    return () => unsubscribe()
  }, [router])

  useEffect(() => {
    return () => {
      recaptchaVerifierRef.current = null;
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const executeProfileSave = async (finalEmail = formData.email) => {
      await updateUserProfile(user.uid, {
        fullName: formData.fullName,
        email: finalEmail,
        phone: formData.phone,
        city: formData.city,
        class: formData.class,
        school: formData.school,
      })

      if (formData.fullName !== profile?.fullName) {
        await updateUserFirebaseProfile({ displayName: formData.fullName })
      }

      setProfile(prev => ({
        ...prev,
        fullName: formData.fullName,
        email: finalEmail,
        phone: formData.phone,
        city: formData.city,
        class: formData.class,
        school: formData.school,
      }));

      setIsEditingProfile(false);
      setSaving(false);
      setSuccessMessage('Profile updated successfully!')
      setTimeout(() => setSuccessMessage(''), 3000)
  }

  const handleSavePersonalInfo = async (e) => {
    e.preventDefault()
    setSaving(true)
    setErrorMessage('')
    setSuccessMessage('')

    try {
      // Intercept Email changes via the robust Gateway
      if (formData.email !== user.email && formData.email) {
         setSaving(false);
         setShowEmailVerifyModal(true);
         setEmailOtpStep(1);
         return; 
      }

      await executeProfileSave();
    } catch (error) {
      console.error('Error updating profile:', error)
      setErrorMessage(error.message || 'Failed to update profile')
      setSaving(false)
    }
  }

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      return setErrorMessage('Please select a valid image file.')
    }
    if (file.size > 5 * 1024 * 1024) {
      return setErrorMessage('File size must be strictly less than 5MB.')
    }

    setUploadingPhoto(true)
    try {
      const storage = getStorage()
      const photoRef = ref(storage, `profile-photos/${user.uid}/${Date.now()}-${file.name}`)
      await uploadBytes(photoRef, file)
      const downloadURL = await getDownloadURL(photoRef)

      await updateUserProfilePhoto(user.uid, downloadURL)
      await updateUserFirebaseProfile({ photoURL: downloadURL })

      setProfile(prev => ({ ...prev, photoURL: downloadURL }))
      setSuccessMessage('Profile photo upgraded successfully!')
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (error) {
      console.error('Error uploading photo:', error)
      setErrorMessage('Failed to upload photo securely.')
    } finally {
      setUploadingPhoto(false)
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  // -------------- Generic Authentication Method Logic --------------
  const triggerOtpDelivery = async (methodToUse, targetPhone, targetEmail) => {
     if (methodToUse === 'phone') {
       if (!targetPhone) throw new Error("No phone number is registered.");
       let e164Phone = targetPhone.startsWith('+') ? targetPhone : `+91${targetPhone}`;
       
       let verifier = recaptchaVerifierRef.current;
       if (!verifier) {
         verifier = setupRecaptcha("recaptcha-container");
         recaptchaVerifierRef.current = verifier;
       }
       return await sendPhoneOtp(e164Phone, verifier);
     } else {
       if (!targetEmail) throw new Error("No email registered.");
       await axios.post('/api/auth/send-otp', { email: targetEmail });
       return targetEmail;
     }
  }

  const verifyOtpCode = async (methodToUse, codeArray, authConfirmationObj) => {
     const code = codeArray.join('');
     if (code.length !== 6) throw new Error("Please enter all 6 digits.");

     if (methodToUse === 'phone') {
       if (!authConfirmationObj) throw new Error("Session expired.");
       const credential = PhoneAuthProvider.credential(authConfirmationObj.verificationId, code);
       await reauthenticateWithCredential(auth.currentUser, credential);
     } else {
       await axios.post('/api/auth/verify-otp', { email: authConfirmationObj, code });
     }
     return true;
  }

  // -------------- OTP Password Flow Helpers --------------
  const handleOtpInput = (index, value) => {
    if (value.length > 1) value = value[0];
    const newOtp = [...verificationOtp];
    newOtp[index] = value;
    setVerificationOtp(newOtp);
    if (value && index < 5) otpInputRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !verificationOtp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const sendOtp = async () => {
    setErrorMessage('');
    setSaving(true);
    try {
       const confirmResult = await triggerOtpDelivery(verificationMethod, profile?.phone || formData.phone, profile?.email || formData.email);
       setOtpConfirmationResult(confirmResult);
       setVerificationOtp(['','','','','','']); 
       setPasswordFlowStep(2);
       setSuccessMessage(`OTP code sent to your ${verificationMethod}!`);
       setTimeout(() => setSuccessMessage(''), 3000);
    } catch(err) {
       setErrorMessage(err.message || "Failed to trigger OTP delivery. Did you register your phone?");
    } finally {
       setSaving(false);
    }
  }

  const verifyOtp = async () => {
    setErrorMessage('');
    setSaving(true);
    try {
      await verifyOtpCode(verificationMethod, verificationOtp, otpConfirmationResult);
      setSuccessMessage('Identity Verified!');
      setPasswordFlowStep(3); 
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch(err) {
      if (err.code === 'auth/invalid-verification-code') {
         setErrorMessage("The code you entered is invalid.");
      } else {
         setErrorMessage(err.response?.data?.error || err.message || "Failed to verify OTP.");
      }
    } finally {
      setSaving(false);
    }
  }

  const saveNewPassword = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSaving(true);
    try {
       if (newPassword !== confirmNewPassword) throw new Error("Passwords do not match.");
       if (newPassword.length < 6) throw new Error("Password must be at least 6 characters.");
       
       const user = auth.currentUser;
       if (!user) throw new Error("Authentication error");
       
       await updatePassword(user, newPassword);

       setSuccessMessage('Your password has been changed securely.');
       setPasswordFlowStep(1);
       setNewPassword('');
       setConfirmNewPassword('');
       setVerificationOtp(['','','','','','']);
       setTimeout(() => setSuccessMessage(''), 4000);
    } catch(err) {
       setErrorMessage(err.message || "Failed to securely save new password.");
    } finally {
       setSaving(false);
    }
  }


  // -------------- Email OTP Security Gateway Helpers --------------
  const handleEmailOtpInput = (index, value) => {
    if (value.length > 1) value = value[0];
    const newOtp = [...emailOtpCode];
    newOtp[index] = value;
    setEmailOtpCode(newOtp);
    if (value && index < 5) emailOtpInputRefs.current[index + 1]?.focus();
  };

  const handleEmailOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !emailOtpCode[index] && index > 0) {
      emailOtpInputRefs.current[index - 1]?.focus();
    }
  };

  const sendEmailGatewayOtp = async () => {
    setErrorMessage('');
    setSaving(true);
    try {
       const confirmResult = await triggerOtpDelivery(emailVerifyMethod, formData.phone || profile?.phone, user?.email);
       setEmailConfirmationResult(confirmResult);
       setEmailOtpCode(['','','','','','']); 
       setEmailOtpStep(2);
    } catch(err) {
       setErrorMessage(err.message || "Failed to trigger OTP delivery.");
    } finally {
       setSaving(false);
    }
  }

  const verifyEmailGatewayOtp = async () => {
    setErrorMessage('');
    setSaving(true);
    try {
      await verifyOtpCode(emailVerifyMethod, emailOtpCode, emailConfirmationResult);
      
      // Update the user's email securely after successful OTP
      await updateUserEmail(auth.currentUser, formData.email);
      await executeProfileSave(formData.email);
      
      setShowEmailVerifyModal(false);
      setSuccessMessage('Identity verified! Email successfully synced to Firebase Authentication.');
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch(err) {
      if (err.code === 'auth/invalid-verification-code') {
         setErrorMessage("The code you entered is invalid.");
      } else if (err.code === 'auth/requires-recent-login') {
         setErrorMessage("Security Requirement: This action mandates a strict RECENT re-authentication via SMS OTP, Email OTP mock acts natively insufficient for this Firebase safeguard. Please select 'SMS Verification'.");
      } else {
         setErrorMessage(err.response?.data?.error || err.message || "Failed to verify OTP.");
      }
    } finally {
      setSaving(false);
    }
  }


  // -------------- Main Render --------------
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6B8B23]"></div>
      </div>
    )
  }

  const tabs = [
    { id: 'personal', label: 'Personal Information', icon: User },
    { id: 'plans', label: 'My Subscription Plans', icon: CreditCard },
    { id: 'password', label: 'Security & Password', icon: Lock },
  ]

  return (
    <main className="min-h-screen h-screen bg-gray-50 font-outfit py-10 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-6xl mx-auto h-[90%] flex flex-col">
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Account Settings</h1>
          <p className="text-gray-500 mt-1 text-lg">Manage your profile, security, and subscription plans.</p>
        </div>

        {successMessage && (
          <div className="mb-6 p-4 bg-green-50/80 border border-green-200 text-green-700 rounded-xl flex items-center shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
            <CheckCircle2 className="w-5 h-5 mr-3 text-green-600 flex-shrink-0" />
            <p className="font-medium">{successMessage}</p>
          </div>
        )}
        {errorMessage && !showEmailVerifyModal && (
          <div className="mb-6 p-4 bg-red-50/80 border border-red-200 text-red-700 rounded-xl flex items-center shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
            <AlertCircle className="w-5 h-5 mr-3 text-red-600 flex-shrink-0" />
            <p className="font-medium">{errorMessage}</p>
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-8 items-stretch flex-grow h-full min-h-[500px]">
          
          <div className="w-full md:w-80 flex-shrink-0 flex flex-col">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-full flex flex-col">
              <div className="bg-[#FAF0DC] p-6 relative flex flex-col items-center flex-shrink-0">
                <div className="absolute top-0 left-0 w-full h-full opacity-50 bg-gradient-to-br from-[#FDD355]/30 to-transparent"></div>
                <div className="relative z-10 flex flex-col items-center">
                  <div className="relative group mb-4">
                    <div className="w-28 h-28 rounded-full bg-white flex items-center justify-center overflow-hidden border-4 border-white shadow-md transition-transform duration-300 group-hover:scale-105">
                      {profile?.photoURL ? (
                        <Image src={profile.photoURL} alt="Profile" width={112} height={112} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-gray-400 flex flex-col items-center justify-center w-full h-full bg-gray-50"><User className="w-10 h-10 mb-1" /></span>
                      )}
                    </div>
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                    <button
                      onClick={() => fileInputRef.current?.click()} disabled={uploadingPhoto}
                      className="absolute bottom-0 right-0 bg-[#FDD355] hover:bg-[#eab308] disabled:opacity-50 text-black rounded-full p-2.5 shadow-lg transition-transform hover:scale-110"
                    ><Camera className="w-4 h-4" /></button>
                  </div>
                  
                  <h2 className="text-xl font-bold text-gray-900 text-center tracking-tight">{profile?.fullName || 'Student'}</h2>
                  <p className="text-sm text-gray-600 mb-3">{profile?.email || 'No email attached'}</p>
                  
                  {profile?.subscription?.tier ? (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#6B8B23] text-white shadow-sm">
                      <ShieldCheck className="w-3 h-3 mr-1" /> {profile.subscription.tier} Plan
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gray-200 text-gray-700 shadow-sm">Free Account</span>
                  )}
                </div>
              </div>

              <nav className="p-4 flex flex-col gap-1.5 flex-grow">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  const isActive = activeTab === tab.id
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                         setActiveTab(tab.id);
                         setErrorMessage('');
                         setSuccessMessage('');
                         setIsEditingProfile(false);
                      }}
                      className={`flex items-center w-full px-4 py-3 rounded-xl transition-all duration-200 text-left ${isActive ? 'bg-[#6B8B23] text-white shadow-md shadow-[#6B8B23]/20 font-semibold' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 font-medium'}`}
                    >
                      <Icon className={`w-5 h-5 mr-3 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                      {tab.label}
                    </button>
                  )
                })}
              </nav>

            </div>
          </div>

          <div className="flex-grow flex flex-col relative z-0">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 h-full overflow-y-auto">
              
              {activeTab === 'personal' && (
                <div className="animate-in fade-in duration-300 flex flex-col h-full">
                  <div className="mb-6 pb-6 border-b border-gray-100 flex justify-between items-center">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Personal Information</h2>
                      <p className="text-gray-500 text-sm mt-1">Review and update your core contact details.</p>
                    </div>
                    {!isEditingProfile && (
                       <button onClick={() => setIsEditingProfile(true)} className="flex items-center gap-2 bg-[#FAF0DC] hover:bg-[#FDD355] text-black font-semibold px-4 py-2 rounded-lg transition-colors">
                         <Edit2 className="w-4 h-4" /> Edit Profile
                       </button>
                    )}
                  </div>
                  
                  <form onSubmit={handleSavePersonalInfo} className="space-y-6 max-w-3xl flex-grow flex flex-col">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 flex items-center">Full Name</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><User className="h-5 w-5 text-gray-400" /></div>
                          <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} disabled={!isEditingProfile} className={`pl-11 w-full px-4 py-3 rounded-xl transition-all outline-none border ${isEditingProfile ? 'bg-white border-gray-200 focus:ring-2 focus:ring-[#6B8B23]/30 focus:border-[#6B8B23]' : 'bg-gray-50 border-transparent text-gray-800 cursor-not-allowed'}`} />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 flex items-center">Email Address</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Mail className="h-5 w-5 text-gray-400" /></div>
                          <input type="email" name="email" value={formData.email} onChange={handleInputChange} disabled={!isEditingProfile} className={`pl-11 w-full px-4 py-3 rounded-xl transition-all outline-none border ${isEditingProfile ? 'bg-white border-gray-200 focus:ring-2 focus:ring-[#6B8B23]/30 focus:border-[#6B8B23]' : 'bg-gray-50 border-transparent text-gray-800 cursor-not-allowed'}`} />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 flex items-center">Phone Number</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Phone className="h-5 w-5 text-gray-400" /></div>
                          <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} disabled={!isEditingProfile} className={`pl-11 w-full px-4 py-3 rounded-xl transition-all outline-none border ${isEditingProfile ? 'bg-white border-gray-200 focus:ring-2 focus:ring-[#6B8B23]/30 focus:border-[#6B8B23]' : 'bg-gray-50 border-transparent text-gray-800 cursor-not-allowed'}`} />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 flex items-center">City</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><MapPin className="h-5 w-5 text-gray-400" /></div>
                          <input type="text" name="city" value={formData.city} onChange={handleInputChange} disabled={!isEditingProfile} className={`pl-11 w-full px-4 py-3 rounded-xl transition-all outline-none border ${isEditingProfile ? 'bg-white border-gray-200 focus:ring-2 focus:ring-[#6B8B23]/30 focus:border-[#6B8B23]' : 'bg-gray-50 border-transparent text-gray-800 cursor-not-allowed'}`} />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 flex items-center">Class / Grade</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><GraduationCap className="h-5 w-5 text-gray-400" /></div>
                          {isEditingProfile ? (
                            <select name="class" value={formData.class} onChange={handleInputChange} className="pl-11 w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#6B8B23]/30 focus:border-[#6B8B23] outline-none transition-all cursor-pointer">
                              <option value="">Select Class</option><option value="8th Grade">8th Grade</option><option value="9th Grade">9th Grade</option><option value="10th Grade">10th Grade</option><option value="11th Grade">11th Grade</option><option value="12th Grade">12th Grade</option>
                            </select>
                          ) : (
                            <input type="text" value={formData.class ? `Class ${formData.class}` : 'Unspecified'} disabled className="pl-11 w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl text-gray-800 cursor-not-allowed" />
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 flex items-center">Institution</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Building className="h-5 w-5 text-gray-400" /></div>
                          <input type="text" name="school" value={formData.school} onChange={handleInputChange} disabled={!isEditingProfile} className={`pl-11 w-full px-4 py-3 rounded-xl transition-all outline-none border ${isEditingProfile ? 'bg-white border-gray-200 focus:ring-2 focus:ring-[#6B8B23]/30 focus:border-[#6B8B23]' : 'bg-gray-50 border-transparent text-gray-800 cursor-not-allowed'}`} />
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 flex justify-end gap-3 mt-auto mb-2">
                      {isEditingProfile && (
                        <>
                          <button
                            type="button"
                            onClick={() => {
                              setIsEditingProfile(false)
                              setFormData({
                                fullName: profile?.fullName || '',
                                email: profile?.email || user?.email || '',
                                phone: profile?.phone || '',
                                city: profile?.city || '',
                                class: profile?.class || '',
                                school: profile?.school || '',
                              });
                            }}
                            className="bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-xl font-bold hover:bg-gray-50 transition-colors"
                          >Cancel</button>
                          <button type="submit" disabled={saving} className="bg-[#6B8B23] hover:bg-[#5a761e] text-white px-8 py-3 rounded-xl font-bold shadow-md shadow-[#6B8B23]/20 disabled:opacity-70 transition-all hover:shadow-lg active:scale-95">
                            {saving ? 'Applying...' : 'Save Changes'}
                          </button>
                        </>
                      )}
                    </div>
                  </form>
                </div>
              )}

              {activeTab === 'plans' && (
                <div className="animate-in fade-in duration-300 h-full">
                  <div className="mb-6 pb-6 border-b border-gray-100 flex justify-between items-center">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Subscription Plans</h2>
                      <p className="text-gray-500 text-sm mt-1">Manage your active plans and browse upgrades.</p>
                    </div>
                  </div>

                  {profile?.subscription ? (
                    <div className="relative overflow-hidden bg-gradient-to-br from-[#FAF0DC] to-[#f4e2b8] rounded-2xl p-8 border border-[#e8ce91] shadow-sm mb-8">
                       <div className="absolute -top-10 -right-10 text-white/40"><ShieldCheck className="w-48 h-48" /></div>
                       <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8">
                         <div>
                           <p className="text-[#a47b19] font-bold tracking-wider text-sm uppercase mb-1">Current License</p>
                           <h3 className="text-4xl font-extrabold text-gray-900 mb-2">{profile.subscription.tier}</h3>
                           <span className="inline-flex items-center px-3 py-1 rounded-md text-xs font-bold bg-green-500/20 text-green-700 uppercase tracking-widest">{profile.subscription.status}</span>
                         </div>
                         <div className="grid grid-cols-2 gap-6 items-center">
                           <div>
                             <p className="text-gray-600 text-sm mb-1">Investment</p>
                             <p className="text-2xl font-bold text-gray-900">₹{(profile.subscription.amount / 100).toFixed(0)}</p>
                           </div>
                           <div>
                             <p className="text-gray-600 text-sm mb-1">Activated Date</p>
                             <p className="text-lg font-semibold text-gray-900">
                               {new Date(profile.subscription.activatedAt).toLocaleDateString(undefined, {month: 'short', day: 'numeric', year: 'numeric'})}
                             </p>
                           </div>
                         </div>
                       </div>
                       <div className="relative z-10 mt-8 pt-6 border-t border-[#e8ce91]/50 flex gap-4">
                         <button onClick={() => router.push('/pricing/students')} className="bg-white hover:bg-gray-50 text-gray-900 px-6 py-2.5 rounded-lg font-semibold shadow-sm border border-gray-200 transition-colors">Explore Upgrades</button>
                       </div>
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded-2xl p-10 text-center border border-gray-100 flex flex-col items-center justify-center mb-8">
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4"><CreditCard className="w-8 h-8 text-gray-400" /></div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">No Premium Plans Yet</h3>
                      <p className="text-gray-500 max-w-md mx-auto mb-6">You're currently using the free tier. Unlock exclusive counseling, full dashboard metrics, and deeper tools with our robust student packages.</p>
                      <button onClick={() => router.push('/pricing/students')} className="bg-[#FDD355] hover:bg-[#eab308] text-black px-8 py-3 rounded-xl font-bold shadow-sm transition-colors">Browse Student Plans</button>
                    </div>
                  )}

                  <div className="bg-white border text-gray-800 border-gray-100 rounded-2xl p-8 shadow-sm">
                    <h3 className="font-bold text-lg mb-4 flex items-center"><CheckCircle2 className="w-5 h-5 mr-2 text-[#6B8B23]" /> Base Discoveries Provided</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                      <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                        <h4 className="font-semibold mb-1 text-gray-900">Career Library</h4>
                        <p className="text-sm text-gray-500">Learn about thousands of global career trajectories.</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                        <h4 className="font-semibold mb-1 text-gray-900">Free Dashboards</h4>
                        <p className="text-sm text-gray-500">Track elementary goals directly from the panel.</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                        <h4 className="font-semibold mb-1 text-gray-900">Identity Control</h4>
                        <p className="text-sm text-gray-500">Full management of this synchronized profile interface.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'password' && (
                <div className="animate-in fade-in duration-300 h-full flex flex-col">
                  <div className="mb-6 pb-6 border-b border-gray-100">
                    <h2 className="text-2xl font-bold text-gray-900">Security Parameters</h2>
                    <p className="text-gray-500 text-sm mt-1">Verify your identity via standard OTP to change your core system password safely.</p>
                  </div>

                  <div className="max-w-xl flex-grow">
                    {passwordFlowStep === 1 && (
                      <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-gray-800">Select Identity Verification Method</h3>
                        <div className="flex flex-col gap-4">
                          <label className={`cursor-pointer rounded-xl border-2 p-5 flex items-start gap-4 transition-all ${verificationMethod === 'phone' ? 'border-[#6B8B23] bg-[#6B8B23]/5' : 'border-gray-200 hover:border-[#FDD355]'}`}>
                            <input type="radio" name="verificationMethod" value="phone" checked={verificationMethod === 'phone'} onChange={() => setVerificationMethod('phone')} className="mt-1 w-4 h-4 text-[#6B8B23] focus:ring-[#6B8B23]" />
                            <div>
                               <p className="font-bold text-gray-900">SMS Verification (Phone)</p>
                               <p className="text-sm text-gray-500 mt-1">Send a 6-digit code to your registered mobile number: <span className="font-medium text-gray-700">{formData.phone || profile?.phone || 'Not found'}</span></p>
                            </div>
                          </label>
                          <label className={`cursor-pointer rounded-xl border-2 p-5 flex items-start gap-4 transition-all ${verificationMethod === 'email' ? 'border-[#6B8B23] bg-[#6B8B23]/5' : 'border-gray-200 hover:border-[#FDD355]'}`}>
                            <input type="radio" name="verificationMethod" value="email" checked={verificationMethod === 'email'} onChange={() => setVerificationMethod('email')} className="mt-1 w-4 h-4 text-[#6B8B23] focus:ring-[#6B8B23]" />
                            <div>
                               <p className="font-bold text-gray-900">Email Verification</p>
                               <p className="text-sm text-gray-500 mt-1">Send a 6-digit code to your registered email id: <span className="font-medium text-gray-700">{formData.email || profile?.email || 'Not found'}</span></p>
                            </div>
                          </label>
                        </div>
                        <div id="recaptcha-container" className="mt-2"></div>
                        <button onClick={sendOtp} disabled={saving} className="bg-gray-900 hover:bg-black text-white px-8 py-3.5 rounded-xl font-bold shadow-md disabled:opacity-70 transition-all flex items-center justify-center mt-6">
                          <ShieldCheck className="w-5 h-5 mr-2" />
                          {saving ? 'Requesting Protocol...' : 'Send Verification OTP'}
                        </button>
                      </div>
                    )}

                    {passwordFlowStep === 2 && (
                       <div className="space-y-6">
                         <div className="text-center bg-gray-50 p-6 rounded-xl border border-gray-200">
                           <h3 className="text-xl font-bold text-gray-900 mb-2">Enter Secure OTP</h3>
                           <p className="text-sm text-gray-600 mb-6">Code was dispatched to your {verificationMethod}.</p>
                           <div className="flex gap-3 justify-center mb-6">
                             {verificationOtp.map((digit, index) => (
                               <input key={index} ref={(el) => (otpInputRefs.current[index] = el)} type="text" inputMode="numeric" maxLength={1} value={digit} onChange={(e) => handleOtpInput(index, e.target.value)} onKeyDown={(e) => handleOtpKeyDown(index, e)} className="w-14 h-14 text-center text-2xl font-bold bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FDD355] focus:border-[#FDD355] outline-none" />
                             ))}
                           </div>
                           <button onClick={verifyOtp} disabled={saving} className="w-full bg-[#FDD355] hover:bg-[#eab308] text-black px-8 py-3.5 rounded-xl font-bold shadow-sm disabled:opacity-50 transition-all">
                             {saving ? 'Authenticating...' : 'Confirm Authentication'}
                           </button>
                         </div>
                         <button onClick={() => {setPasswordFlowStep(1); setVerificationOtp(['','','','','','']); setErrorMessage('');}} className="text-gray-500 text-sm hover:underline flex items-center justify-center w-full">
                            ← Use a different verification method
                         </button>
                       </div>
                    )}

                    {passwordFlowStep === 3 && (
                      <form onSubmit={saveNewPassword} className="space-y-5 animate-in slide-in-from-right-4 duration-300">
                        <div className="bg-[#6B8B23]/10 p-4 rounded-xl border border-[#6B8B23]/20 mb-6 flex items-start gap-3">
                           <CheckCircle2 className="w-5 h-5 text-[#6B8B23] mt-0.5" />
                           <p className="text-sm text-gray-800">Identity successfully confirmed. You may now securely replace your dashboard password.</p>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-gray-700">Secured New Password</label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Lock className="h-5 w-5 text-gray-400" /></div>
                            <input type={showPassword ? 'text' : 'password'} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="pl-11 pr-12 w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#6B8B23]/30 focus:border-[#6B8B23] outline-none transition-all" placeholder="Minimum 6 characters" required />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center hover:text-gray-700 text-gray-400">
                              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-gray-700">Confirm Secured Password</label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Lock className="h-5 w-5 text-gray-400" /></div>
                            <input type={showPassword ? 'text' : 'password'} value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} className="pl-11 pr-12 w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#6B8B23]/30 focus:border-[#6B8B23] outline-none transition-all" placeholder="Retype password perfectly" required/>
                          </div>
                        </div>
                        <div className="mt-8">
                          <button type="submit" disabled={saving} className="bg-gray-900 hover:bg-black text-white px-8 py-3.5 rounded-xl font-bold w-full sm:w-auto shadow-md disabled:opacity-70 transition-all active:scale-95 flex items-center justify-center">
                            <ShieldCheck className="w-5 h-5 mr-2" />{saving ? 'Encrypting...' : 'Update Secret Engine'}
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* --- SECURE EMAIL OTP VERIFICATION MODAL --- */}
      {showEmailVerifyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 max-w-md w-full relative">
            <button onClick={() => { setShowEmailVerifyModal(false); setErrorMessage(''); }} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 bg-gray-100 rounded-full p-1 transition-colors">
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Security Verification</h2>
            <p className="text-gray-500 text-sm mb-6">Updating a core Firebase element (Email Address) enforces a rigorous identity re-verification policy. Please confirm it's you.</p>

            {errorMessage && (
              <div className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">{errorMessage}</div>
            )}

            {emailOtpStep === 1 && (
               <div className="space-y-4">
                  <label className={`cursor-pointer rounded-xl border-2 p-4 flex items-start gap-4 transition-all ${emailVerifyMethod === 'phone' ? 'border-[#6B8B23] bg-[#6B8B23]/5' : 'border-gray-200 hover:border-[#FDD355]'}`}>
                     <input type="radio" value="phone" checked={emailVerifyMethod === 'phone'} onChange={() => setEmailVerifyMethod('phone')} className="mt-1 w-4 h-4 text-[#6B8B23]" />
                     <div><p className="font-bold text-gray-900">SMS Verification (Natively Supported)</p><p className="text-xs text-gray-500 mt-1">Send a 6-digit pin to `{formData.phone}` allowing secure Firebase updates.</p></div>
                  </label>
                  <label className={`cursor-pointer rounded-xl border-2 p-4 flex items-start gap-4 transition-all opacity-50 ${emailVerifyMethod === 'email' ? 'border-[#6B8B23] bg-[#6B8B23]/5' : 'border-gray-200 hover:border-[#FDD355]'}`}>
                     <input type="radio" value="email" checked={emailVerifyMethod === 'email'} onChange={() => setEmailVerifyMethod('email')} className="mt-1 w-4 h-4 text-[#6B8B23]" />
                     <div><p className="font-bold text-gray-900">Email Verification (Mock Bypass)</p><p className="text-xs text-gray-500 mt-1">Will not satisfy native robust Firebase safeguards. For demo purposes only.</p></div>
                  </label>
                  <div id="recaptcha-container" className="mt-2"></div>
                  <button onClick={sendEmailGatewayOtp} disabled={saving} className="w-full bg-[#FDD355] hover:bg-[#eab308] text-black px-6 py-3 rounded-xl font-bold shadow-sm mt-2 transition-all">{saving ? 'Processing...' : 'Generate Secure OTP'}</button>
               </div>
            )}

            {emailOtpStep === 2 && (
               <div className="space-y-4">
                  <div className="flex gap-2 justify-center mb-4">
                    {emailOtpCode.map((digit, index) => (
                      <input key={index} ref={(el) => (emailOtpInputRefs.current[index] = el)} type="text" inputMode="numeric" maxLength={1} value={digit} onChange={(e) => handleEmailOtpInput(index, e.target.value)} onKeyDown={(e) => handleEmailOtpKeyDown(index, e)} className="w-12 h-14 text-center text-xl font-bold bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FDD355] focus:border-[#FDD355] outline-none" />
                    ))}
                  </div>
                  <button onClick={verifyEmailGatewayOtp} disabled={saving} className="w-full bg-gray-900 hover:bg-black text-white px-6 py-3 rounded-xl font-bold shadow-sm transition-all">{saving ? 'Authenticating...' : 'Confirm Authentication'}</button>
                  <button onClick={() => { setEmailOtpStep(1); setEmailOtpCode(['','','','','','']); }} className="text-gray-500 text-sm hover:underline block text-center w-full mt-2">← Back to Options</button>
               </div>
            )}
          </div>
        </div>
      )}

    </main>
  )
}
