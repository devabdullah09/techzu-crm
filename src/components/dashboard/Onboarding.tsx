import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Onboarding = () => {
  const navigate = useNavigate();
  const [targetIndustries, setTargetIndustries] = useState<string[]>([]);
  const [operatingYears, setOperatingYears] = useState<number>(0);
  const [employeeSize, setEmployeeSize] = useState<[number, number]>([1, 10]);
  const [valueProposition, setValueProposition] = useState<string>("");
  const [preferredMeetingSlots, setPreferredMeetingSlots] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Debug token on component mount
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    console.log("On mount - Access token:", token || "No token found");
  }, []);

  const toggleIndustry = (industry: string) => {
    console.log(`Toggling industry: ${industry}`);
    setTargetIndustries((prev) =>
      prev.includes(industry)
        ? prev.filter((i) => i !== industry)
        : [...prev, industry]
    );
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("handleSave triggered");
    setSaving(true);
    setError(null);

    // Validate inputs
    if (targetIndustries.length === 0) {
      console.log("Validation failed: No target industries selected");
      setError("Please select at least one target industry.");
      setSaving(false);
      return;
    }
    if (operatingYears < 0) {
      console.log("Validation failed: Negative operating years");
      setError("Operating years cannot be negative.");
      setSaving(false);
      return;
    }
    if (employeeSize[0] > employeeSize[1]) {
      console.log("Validation failed: Invalid employee size range");
      setError("Minimum employee size cannot exceed maximum.");
      setSaving(false);
      return;
    }

    // Check for access token
    const accessToken = localStorage.getItem("access_token");
    console.log("Access token:", accessToken || "No token found");
    if (!accessToken) {
      console.log("No access token, redirecting to login");
      setError("Please log in to continue. No access token found.");
      setSaving(false);
      navigate("/login", { replace: true, state: { from: "/onboarding" } });
      return;
    }

    // Convert preferredMeetingSlots string to array
    const meetingSlotsArray = preferredMeetingSlots
      .split("/")
      .map(slot => slot.trim().charAt(0).toUpperCase() + slot.trim().slice(1).toLowerCase())
      .filter(slot => slot);
    console.log("Meeting slots array:", meetingSlotsArray);

    const payload = {
      target_industries: targetIndustries,
      operating_years: operatingYears,
      employee_size_min: employeeSize[0],
      employee_size_max: employeeSize[1],
      value_proposition: valueProposition || null,
      preferred_meeting_slots: meetingSlotsArray.length > 0 ? meetingSlotsArray : null,
    };
    console.log("Payload:", JSON.stringify(payload, null, 2));

    try {
      console.log("Sending request to /owners/onboarding");
      const response = await fetch("https://513ef456804f.ngrok-free.app/owners/onboarding", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      });

      console.log("Response status:", response.status);
      const responseData = await response.json();
      console.log("Response data:", responseData);

      if (!response.ok) {
        console.log("Request failed:", responseData.detail);
        if (response.status === 401) {
          setError("Authentication failed. Please log in again.");
          navigate("/login", { replace: true, state: { from: "/onboarding" } });
        } else {
          throw new Error(responseData.detail || "Failed to save onboarding data");
        }
      }

      console.log("✅ Onboarding saved:", responseData);
      localStorage.setItem("onboardingCompleted", "true");
      localStorage.removeItem("firstSignup");
      navigate("/dashboard", { replace: true });
    } catch (err: any) {
      console.error("❌ Onboarding error:", err.message);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const industries = [
    "Technology",
    "Healthcare",
    "Finance",
    "Retail",
    "Manufacturing",
    "Education",
  ];

  return (
    <div className="page-content">
      <div className="page-header">
        <h1>Complete Onboarding</h1>
        <p>Please provide details to personalize your CRM experience.</p>
      </div>

      <form
        className="table-container"
        onSubmit={(e) => {
          console.log("Form submitted");
          handleSave(e);
        }}
        style={{ maxWidth: 840 }}
      >
        <h2>Business Information</h2>

        <div className="form-group">
          <label>Target Industries</label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {industries.map((ind) => (
              <button
                type="button"
                key={ind}
                onClick={() => toggleIndustry(ind)}
                className={`filter-btn ${
                  targetIndustries.includes(ind) ? "active" : ""
                }`}
              >
                {ind}
              </button>
            ))}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Operating Years</label>
            <input
              type="number"
              min={0}
              value={operatingYears}
              onChange={(e) => {
                console.log("Operating years changed:", e.target.value);
                setOperatingYears(Number(e.target.value));
              }}
              placeholder="e.g., 5"
            />
          </div>
          <div className="form-group">
            <label>Employee Size (Range)</label>
            <div style={{ display: "flex", gap: 8 }}>
              <input
                type="number"
                min={1}
                value={employeeSize[0]}
                onChange={(e) => {
                  console.log("Employee size min changed:", e.target.value);
                  setEmployeeSize([Number(e.target.value), employeeSize[1]]);
                }}
                placeholder="Min"
              />
              <input
                type="number"
                min={employeeSize[0]}
                value={employeeSize[1]}
                onChange={(e) => {
                  console.log("Employee size max changed:", e.target.value);
                  setEmployeeSize([employeeSize[0], Number(e.target.value)]);
                }}
                placeholder="Max"
              />
            </div>
          </div>
        </div>

        <div className="form-group">
          <label>Value Proposition</label>
          <textarea
            rows={4}
            value={valueProposition}
            onChange={(e) => {
              console.log("Value proposition changed:", e.target.value);
              setValueProposition(e.target.value);
            }}
            placeholder="Describe your core value proposition"
            style={{
              width: "100%",
              padding: 12,
              background: "white",
              border: "2px solid #e5e7eb",
              borderRadius: 8,
              fontSize: 14,
              color: "#1f2937",
            }}
          />
        </div>

        <div className="form-group">
          <label>Preferred Meeting Slots (Days/Times)</label>
          <input
            type="text"
            value={preferredMeetingSlots}
            onChange={(e) => {
              console.log("Preferred meeting slots changed:", e.target.value);
              setPreferredMeetingSlots(e.target.value);
            }}
            placeholder="e.g., Mon/Wed/Fri 10:00-12:00"
          />
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button
          className="auth-button"
          type="submit"
          disabled={saving}
        >
          {saving ? "Saving..." : "Save and Finish"}
        </button>
      </form>
    </div>
  );
};

export default Onboarding;