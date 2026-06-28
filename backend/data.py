import random
import uuid
from datetime import date, timedelta

# ── CONFIG ── change these numbers before running ──────────────────────────
NUM_CUSTOMERS = 1000
# ───────────────────────────────────────────────────────────────────────────

random.seed(42)  # remove this line if you want different data each run

# ── NAME POOLS ─────────────────────────────────────────────────────────────
FIRST_NAMES = [
    "Aisha", "Emeka", "Ngozi", "Tunde", "Amara", "Chidi", "Fatima", "Yemi",
    "Kemi", "Bayo", "Sola", "Ifunanya", "Dami", "Seun", "Adaeze", "Uche",
    "Musa", "Halima", "Ibrahim", "Zainab", "Chinwe", "Obinna", "Nneka", "Ekene",
    "James", "Sarah", "Michael", "Emily", "David", "Rachel", "Daniel", "Sophie",
    "Mohammed", "Layla", "Omar", "Nadia", "Tariq", "Yasmin", "Hassan", "Mariam",
    "Liam", "Olivia", "Noah", "Emma", "Ethan", "Ava", "Lucas", "Mia",
    "Santiago", "Valentina", "Mateo", "Isabella", "Sebastián", "Camila", "Andrés", "Lucia",
    "Wei", "Mei", "Jun", "Xin", "Fang", "Ling", "Hao", "Yan",
    "Priya", "Arjun", "Rohan", "Anjali", "Vikram", "Pooja", "Rahul", "Divya",
    "Kofi", "Ama", "Kwame", "Abena", "Kweku", "Akosua", "Fiifi", "Efua",
]

LAST_NAMES = [
    "Bello", "Osei", "Adeyemi", "Fashola", "Nwosu", "Eze", "Musa", "Okonkwo",
    "Afolabi", "Babatunde", "Chukwu", "Danladi", "Ekwueme", "Fola", "Garba", "Hassan",
    "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis",
    "Wilson", "Moore", "Taylor", "Anderson", "Thomas", "Jackson", "White", "Harris",
    "Al-Rashid", "Al-Farsi", "Hassan", "Khalid", "Mansour", "Nasser", "Qureshi", "Saleh",
    "Chen", "Wang", "Li", "Zhang", "Liu", "Yang", "Huang", "Wu",
    "Sharma", "Patel", "Singh", "Kumar", "Gupta", "Mehta", "Joshi", "Reddy",
    "Mensah", "Asante", "Boateng", "Darko", "Owusu", "Agyei", "Ofori", "Acheampong",
    "Silva", "Santos", "Oliveira", "Costa", "Ferreira", "Rodrigues", "Alves", "Pereira",
    "Müller", "Schmidt", "Schneider", "Fischer", "Weber", "Meyer", "Wagner", "Becker",
]

COMPANY_PREFIXES = [
    "Cloud", "Data", "Scale", "Qore", "Helix", "Loop", "Nova", "Strat",
    "Apex", "Nexus", "Flux", "Pulse", "Orbit", "Velo", "Zeta", "Prism",
    "Forge", "Stack", "Grid", "Arc", "Peak", "Core", "Edge", "Base",
    "Swift", "Bright", "Clear", "Smart", "Sharp", "Bold", "Lean", "Deep",
]

COMPANY_SUFFIXES = [
    "Stack", "Bridge", "Pro", "Systems", "Analytics", "Logic", "Tech", "AI",
    "Labs", "Works", "Hub", "Base", "Ops", "Flow", "Sync", "Forge",
    "HQ", "IO", "Inc", "Ltd", "Group", "Solutions", "Ventures", "Studio",
    "Cloud", "Data", "Metrics", "Insights", "Platform", "Engine", "Network", "Wire",
]

EMAIL_DOMAINS = [
    "io", "com", "ai", "dev", "co", "ng", "tech", "app",
]

ACQUISITION_CHANNELS = [
    "Organic", "LinkedIn Ads", "Google Ads", "Referral",
    "Content Marketing", "Webinar", "Cold Outreach", "Partner",
]

SALES_REPS = ["Sales Rep A", "Sales Rep B", "Sales Rep C", "Sales Rep D"]

PIPELINE_STAGES = ["Prospect", "Qualified", "Demo Scheduled", "Proposal Sent", "Closed Won", "Closed Lost"]

CAMPAIGN_CHANNELS = ["Email", "LinkedIn", "Email + LinkedIn", "In-app + Email", "Sales outreach", "SMS + Email"]

# Behavioral event sequences per segment — realistic progression
SEGMENT_EVENT_SEQUENCES = {
    "Champion": [
        ["signed_up", "completed_onboarding", "upgraded_plan", "invited_team", "used_api", "renewed_contract"],
        ["signed_up", "booked_demo", "upgraded_plan", "invited_team", "used_api", "expanded_seats"],
        ["signed_up", "completed_onboarding", "used_api", "upgraded_plan", "invited_team", "booked_demo", "renewed_contract"],
    ],
    "High Intent": [
        ["signed_up", "viewed_pricing", "booked_demo", "started_trial"],
        ["signed_up", "viewed_pricing", "started_trial", "booked_demo"],
        ["signed_up", "booked_demo", "viewed_pricing", "started_trial", "completed_onboarding"],
    ],
    "At Risk": [
        ["signed_up", "logged_in", "inactive_30_days"],
        ["signed_up", "completed_onboarding", "inactive_60_days"],
        ["signed_up", "logged_in", "used_api", "inactive_30_days"],
    ],
    "New User": [
        ["signed_up"],
        ["signed_up", "completed_onboarding"],
        ["signed_up", "viewed_pricing"],
    ],
}

SEGMENT_LTV_RANGES = {
    "Champion":    (30000, 120000),
    "High Intent": (5000,  20000),
    "At Risk":     (3000,  18000),
    "New User":    (0,     0),
}

SEGMENT_WEIGHTS = [0.15, 0.25, 0.25, 0.35]  # Champion, High Intent, At Risk, New User
SEGMENT_NAMES   = ["Champion", "High Intent", "At Risk", "New User"]

STAGE_WEIGHTS       = [0.25, 0.20, 0.20, 0.15, 0.12, 0.08]
STAGE_VALUE_RANGES  = {
    "Prospect":       (3000,  10000),
    "Qualified":      (8000,  20000),
    "Demo Scheduled": (12000, 30000),
    "Proposal Sent":  (15000, 50000),
    "Closed Won":     (20000, 120000),
    "Closed Lost":    (5000,  40000),
}

# ── GENERATORS ─────────────────────────────────────────────────────────────

def random_date(start_days_ago: int, end_days_ago: int = 0) -> str:
    delta = random.randint(end_days_ago, start_days_ago)
    return (date.today() - timedelta(days=delta)).isoformat()

def generate_email(first: str, last: str, company: str) -> str:
    company_slug = company.lower().replace(" ", "").replace(".", "")[:12]
    domain = random.choice(EMAIL_DOMAINS)
    patterns = [
        f"{first.lower()}.{last.lower()}@{company_slug}.{domain}",
        f"{first[0].lower()}{last.lower()}@{company_slug}.{domain}",
        f"{first.lower()}@{company_slug}.{domain}",
    ]
    return random.choice(patterns)

def generate_company() -> str:
    return f"{random.choice(COMPANY_PREFIXES)}{random.choice(COMPANY_SUFFIXES)}"

def generate_customers(n: int) -> list:
    customers = []
    used_companies = {}

    for i in range(n):
        first   = random.choice(FIRST_NAMES)
        last    = random.choice(LAST_NAMES)
        company = generate_company()
        segment = random.choices(SEGMENT_NAMES, weights=SEGMENT_WEIGHTS, k=1)[0]
        ltv_min, ltv_max = SEGMENT_LTV_RANGES[segment]
        ltv     = random.randint(ltv_min, ltv_max) if ltv_max > 0 else 0
        events  = random.choice(SEGMENT_EVENT_SEQUENCES[segment])

        if segment in ["At Risk"]:
            last_active = random_date(180, 31)
        elif segment == "New User":
            last_active = random_date(7, 0)
        else:
            last_active = random_date(14, 0)

        customer_id = f"C{str(i+1).zfill(5)}"
        used_companies[customer_id] = company

        customers.append({
            "id":                  customer_id,
            "name":                f"{first} {last}",
            "company":             company,
            "email":               generate_email(first, last, company),
            "segment":             segment,
            "ltv":                 ltv,
            "events":              events,
            "acquisition_channel": random.choice(ACQUISITION_CHANNELS),
            "last_active":         last_active,
        })

    return customers, used_companies

def generate_pipeline(customers: list, used_companies: dict) -> list:
    pipeline = []
    eligible = [c for c in customers if c["segment"] in ["High Intent", "Champion", "At Risk", "New User"]]
    # give roughly 60% of customers a deal
    sampled = random.sample(eligible, min(len(eligible), int(len(eligible) * 0.6)))

    for i, customer in enumerate(sampled):
        stage = random.choices(PIPELINE_STAGES, weights=STAGE_WEIGHTS, k=1)[0]
        val_min, val_max = STAGE_VALUE_RANGES[stage]
        value = random.randint(val_min, val_max)

        if stage in ["Closed Won", "Closed Lost"]:
            close_date = random_date(180, 30)
        else:
            close_date = random_date(0, -60)  # future date

        lead_score = {
            "Closed Won":     random.randint(88, 99),
            "Proposal Sent":  random.randint(65, 87),
            "Demo Scheduled": random.randint(55, 80),
            "Qualified":      random.randint(40, 65),
            "Prospect":       random.randint(20, 45),
            "Closed Lost":    random.randint(10, 40),
        }[stage]

        pipeline.append({
            "id":          f"D{str(i+1).zfill(5)}",
            "customer_id": customer["id"],
            "company":     customer["company"],
            "owner":       random.choice(SALES_REPS),
            "stage":       stage,
            "value":       value,
            "close_date":  close_date,
            "lead_score":  lead_score,
        })

    return pipeline

def generate_segments(customers: list) -> list:
    counts = {s: sum(1 for c in customers if c["segment"] == s) for s in SEGMENT_NAMES}
    avg_ltvs = {}
    for s in SEGMENT_NAMES:
        seg_customers = [c for c in customers if c["segment"] == s]
        avg_ltvs[s] = int(sum(c["ltv"] for c in seg_customers) / len(seg_customers)) if seg_customers else 0

    return [
        {"id": "S001", "name": "Champions",   "description": "High LTV users who upgraded and invited teammates", "count": counts["Champion"],    "avg_ltv": avg_ltvs["Champion"],    "recommended_action": "Upsell to Enterprise tier"},
        {"id": "S002", "name": "High Intent", "description": "Users who booked a demo or started a trial",        "count": counts["High Intent"], "avg_ltv": avg_ltvs["High Intent"], "recommended_action": "Assign to sales rep immediately"},
        {"id": "S003", "name": "At Risk",     "description": "Previously active users, inactive 30+ days",        "count": counts["At Risk"],     "avg_ltv": avg_ltvs["At Risk"],     "recommended_action": "Trigger re-engagement email sequence"},
        {"id": "S004", "name": "New Users",   "description": "Signed up in the last 7 days",                      "count": counts["New User"],    "avg_ltv": avg_ltvs["New User"],    "recommended_action": "Send onboarding checklist"},
    ]

def generate_campaigns(segments: list) -> list:
    seg_counts = {s["name"]: s["count"] for s in segments}
    def campaign_stats(seg_name, open_rate, conv_rate):
        sent      = seg_counts.get(seg_name, 0)
        opened    = int(sent * open_rate)
        converted = int(sent * conv_rate)
        return sent, opened, converted

    hi_sent, hi_open, hi_conv   = campaign_stats("High Intent", 0.72, 0.25)
    ar_sent, ar_open, ar_conv   = campaign_stats("At Risk",     0.50, 0.14)
    ch_sent, ch_open, ch_conv   = campaign_stats("Champions",   1.00, 0.43)
    nu_sent, nu_open, nu_conv   = campaign_stats("New Users",   0.89, 0.35)

    return [
        {"id": "CAM001", "name": "Demo Follow-up Sequence", "segment": "High Intent", "trigger": "Booked demo",        "channel": "Email",            "status": "Active", "sent": hi_sent, "opened": hi_open, "converted": hi_conv},
        {"id": "CAM002", "name": "Win-Back Flow",           "segment": "At Risk",     "trigger": "Inactive 30 days",   "channel": "Email + LinkedIn", "status": "Active", "sent": ar_sent, "opened": ar_open, "converted": ar_conv},
        {"id": "CAM003", "name": "Enterprise Upsell",       "segment": "Champions",   "trigger": "Team invite sent",   "channel": "Sales outreach",   "status": "Active", "sent": ch_sent, "opened": ch_open, "converted": ch_conv},
        {"id": "CAM004", "name": "Onboarding Nudge",        "segment": "New Users",   "trigger": "Day 3 after signup", "channel": "In-app + Email",   "status": "Paused", "sent": nu_sent, "opened": nu_open, "converted": nu_conv},
    ]

# ── GENERATE EVERYTHING ────────────────────────────────────────────────────
CUSTOMERS, _company_map = generate_customers(NUM_CUSTOMERS)
PIPELINE   = generate_pipeline(CUSTOMERS, _company_map)
SEGMENTS   = generate_segments(CUSTOMERS)
CAMPAIGNS  = generate_campaigns(SEGMENTS)