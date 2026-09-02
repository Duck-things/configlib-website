# ConfigLib — deploy guide

This folder is the whole website plus the admin login backend.
Keep the folder structure exactly as it is:

    configlib-site/
      index.html                      <- the site
      netlify.toml                    <- routes /api/* to the functions
      package.json                    <- installs @netlify/blobs
      netlify/
        functions/
          login.js                    <- checks the password on the server
          save-parts.js               <- saves the library for everyone
          get-parts.js                <- serves the live library

Do NOT flatten it. Netlify looks for functions in netlify/functions/.

--------------------------------------------------------------------
STEP 1 — set the two secrets in Netlify
--------------------------------------------------------------------
Netlify dashboard -> your site -> Site configuration -> Environment variables.
Add these two (check "Contains secret values" for both):

  CONFIGLIB_ADMINS
    value: simba:PICK_A_PASSWORD,achyut:PICK_A_PASSWORD
    (username:password pairs, commas between people, NO spaces)
    Because it is marked secret, Netlify makes you paste the value into
    each deploy context box. Put the SAME value in Production and Deploy
    Previews. Leave "Local development" blank.

  CONFIGLIB_SECRET
    value: any long random string, e.g. k9Fmz2Qp7xLr4wNvB8tHcJ3sYd6aE1gU0
    (you never type this anywhere else; it just signs login tokens)

Save both.

--------------------------------------------------------------------
STEP 2 — deploy this folder
--------------------------------------------------------------------
Option A - drag and drop:
  Netlify -> Deploys -> drag the WHOLE configlib-site folder onto the
  "drag and drop" area. Wait for it to finish building.

Option B - GitHub (smoother for future edits):
  Push this folder to a GitHub repo, then in Netlify "Import from Git"
  and pick it. Every push auto-deploys and installs package.json.

--------------------------------------------------------------------
STEP 3 — check the backend is live
--------------------------------------------------------------------
Open this URL in your browser:

  https://YOUR-SITE.netlify.app/api/get-parts

  - see [] or a list of parts  -> functions work, continue
  - see "Page not found" / 404  -> the folder structure or netlify.toml
                                    didn't deploy. Re-check STEP 2.

--------------------------------------------------------------------
STEP 4 — log in
--------------------------------------------------------------------
On the site: footer -> Admin -> sign in with one of the
username:password pairs you put in CONFIGLIB_ADMINS.

  - Add / remove parts in the admin bar.
  - "Publish live" saves for everyone (through the server).
  - "Export parts.json" is an offline backup you can commit yourself.

--------------------------------------------------------------------
Notes
--------------------------------------------------------------------
- The site source has NO passwords in it (ALLOW_LOCAL_ADMIN is false,
  ADMINS is empty). Login only works once STEPS 1-2 are done. If you
  deploy before setting the env vars, admin login will fail until you do.
- Changing/adding admins later = edit the CONFIGLIB_ADMINS env var in
  Netlify and redeploy. No code change needed.
- The 3D part previews and everything else work with no backend at all.
