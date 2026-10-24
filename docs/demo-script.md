# FDR Trust Ledger — Demonstration Script for Judges

This walkthrough demonstrates the end-to-end lifecycle of institutional security deposit custody, multi-tier automated scrutiny, and cryptographic audit guarantees.

---

### Step 1: Login & Role Selection
1. Open `http://localhost:5173`.
2. Notice the calm, dense government interface with single-color deep navy palette and no marketing clutter.
3. Click **"Sign in to portal"**.
4. Use the quick demo preset buttons at the bottom of the card:
   - Click **"Officer"** to pre-fill credentials for `rk.pandey@aicte.gov.in`.
   - Click **"Sign in to portal"**.

---

### Step 2: Officer Dashboard Scrutiny
1. View the **row of summary metrics**: Active, Expiring in 30d, Matured, Renewed, Released, and Pending verification.
2. Examine the **Upcoming maturities schedule**: plain single-color bar chart grouping upcoming expirations by calendar month.
3. Observe the **Top high-risk FDRs requiring scrutiny** table below the chart, sorted dynamically by lowest health score.
4. Click on the **"Why?"** link next to any health score (e.g., Score 35 or 55) to inspect the exact deduction breakdown rules in plain words.

---

### Step 3: Three-Way Verification & Discrepancy Resolution
1. Navigate to **"Verification queue"** in the sidebar.
2. Locate FDR `#55219387640` (Shri Ram Institute of Technology) flagged with **"amount mismatch"**.
3. Click the row to open the **FDR Review page**:
   - Compare the three columns side-by-side:
     1. **Submitted by institution**: Rs 10,00,000
     2. **Read from document (OCR)**: Rs 10,00,000
     3. **Bank response**: Rs 7,50,000 (highlighted in red)
   - Observe how the system detected that the institution submitted a deposit claim higher than what the bank holds on record.
4. In the **Scrutiny observations** box, enter: `"Amount discrepancy flagged for senior audit inquiry."`
5. Click **"Flag for senior review"**.

---

### Step 4: Coverage Gap Timeline & Gantt Audit
1. Navigate to **"Coverage gap timeline"** in the sidebar.
2. Notice the overall institutions summary.
3. Select **"Maulana Azad NIT, Bhopal"** from the dropdown:
   - Observe the horizontal Gantt bars:
     - Old FDR `#32817694250` matured on **10-Mar-2025**.
     - Renewal FDR `#43726180594` commences on **25-Mar-2025**.
   - Notice the prominent red banner: **"Uncovered period from 10-Mar-2025 to 25-Mar-2025 (15 days gap)"**.

---

### Step 5: Institution Workflow — Upload, OCR & Renewal Gap Warning
1. Use the **"View as: Institution"** button in the top bar to instantly switch perspective to Principal Dr. Meena Sharma (Government Engineering College, Raipur).
2. On the **Institution dashboard**, see the **Action required** banner: `"FDR #44738291056 matures in 21 days: submit renewal"`.
3. In the sidebar, click **"Submit new FDR"**:
   - In the upload zone on the left, drop any sample file or click to browse.
   - Watch the simulated OCR pipeline extract details with 98% confidence.
   - Notice every form field on the right is marked: `Read from document, please confirm`.
   - Submit the form to place it on the regulatory ledger.
4. Click **"Renew FDR"** on an existing record:
   - Alter the replacement start date to be after the old maturity date.
   - Watch the inline **Coverage Gap Warning banner** appear live, alerting the institution before submission.

---

### Step 6: Three-Tier Release Approvals
1. Switch back to **"Officer"** via topbar.
2. In the sidebar, navigate to **"Release approvals"**.
3. Click on the pending release request for **Vidyalankar Institute of Technology (FDR #88104629375)**.
4. The slide-in drawer displays the **Statutory Approval Chain**:
   - Tier 1: Scrutiny Officer (Approved)
   - Tier 2: Section Head (Action Required — Highlighted)
   - Tier 3: Competent Authority (Pending)
5. Enter endorsement remarks and click **"Approve as Section Head"**. Watch the status advance in real-time.

---

### Step 7: Cryptographic Hash Chain Audit & Live Tampering Demo
1. Switch to **"Admin"** view via the topbar, or click **"Audit ledger"** in the sidebar.
2. Observe the cryptographic hash chain table showing timestamps, users, actions, previous hash prefix, and current SHA-256 hash prefix.
3. Click **"Verify integrity"**:
   - Green confirmation banner appears: `"Chain intact: 5 entries verified"`.
4. Click **"Tamper entry (Demo)"**:
   - An intentional modification is executed on ledger record #3 (altering the principal amount without updating the cryptographic hash).
5. Click **"Verify integrity"** again:
   - Red integrity alert appears: **"Cryptographic integrity breach detected! Chain broken at entry 3"** with the exact mismatching hash digest.
6. Click **"Restore"** to re-validate the ledger.

---

### Step 8: Simulated Core Banking Console
1. Click **"Mock Bank"** in the topbar or navigate to `/mock-bank`.
2. Notice the prominent **"Simulated bank for demonstration"** banner.
3. Review incoming verification inquiries from AICTE.
4. Click **"Confirm"** on any request:
   - Watch the system compute an authentic HMAC-SHA256 digital signature.
   - Notice the status update and digital signature hash prefix display.
