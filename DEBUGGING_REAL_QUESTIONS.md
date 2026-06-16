## DEBUGGING STEPS — Real Questions Not Loading

### 1. Check Browser Console
- Open: **F12** or **Ctrl+Shift+I** to open Developer Tools
- Go to **Console** tab
- Reload the page at `/dashboard/assessment/career-interests`
- Look for messages starting with:
  - `[assessment]` — Assessment page logs
  - `[profileStore]` — Profile fetching logs
  - `[questions]` — Questions API logs

**What to send me:**
- Copy ALL console messages related to these prefixes
- Screenshot the error (if any)

---

### 2. Most Likely Issues

Check your Firestore `users/{userId}` document has:

```
{
  "email": "...",
  "name": "...",
  "class": "10"  ← MUST be set (e.g., "8", "9", "10", "11", "12")
  "tier": "degree_explorer"  ← OR "purchasedTier" (must be set!)
}
```

**If class is missing:**
- The test will default to `streamSelector`
- But then it fails because no tier is set

**If tier is missing:**
- API returns: `Error: No tier/subscription found`
- Add tier to user profile (set to `"degree_explorer"` or `"stream_fit"`)

---

### 3. Check Firestore Data

Go to **Firebase Console → Firestore** and verify:

```
questionBank/
  ├─ degreeExplorer/
  │   └─ interests/
  │       └─ items (document with likertItems[], forcedChoiceItems[])
  └─ streamSelector/
      └─ interests/
          └─ items (document with likertItems[], forcedChoiceItems[])
```

If these don't exist, the API will return 404.

---

### 4. Quick Fix Checklist

- [ ] User has `class` field set in Firestore
- [ ] User has `tier` or `purchasedTier` field set  
- [ ] Firestore `questionBank` collection exists
- [ ] Firestore has documents at the paths shown above
- [ ] Check console for actual error message

---

### Send me:
1. Full console output (copy/paste)
2. Screenshot of user profile in Firestore
3. Screenshot showing if `questionBank` exists in Firestore
