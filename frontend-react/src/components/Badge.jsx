const map = {
  "Champion":       "champion",
  "High Intent":    "highintent",
  "At Risk":        "atrisk",
  "New User":       "newuser",
  "Active":         "active",
  "Paused":         "paused",
  "Closed Won":     "won",
  "Closed Lost":    "lost",
  "Prospect":       "prospect",
  "Qualified":      "qualified",
  "Demo Scheduled": "demo",
  "Proposal Sent":  "proposal",
};

export default function Badge({ value }) {
  return (
    <span className={`badge badge-${map[value] || "prospect"}`}>{value}</span>
  );
}