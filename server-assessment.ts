// Add this to your server.ts file

import { createClient } from "@supabase/supabase-js";

// Initialize Supabase (add to your server setup)
const supabaseUrl = process.env.VITE_SUPABASE_URL || "https://lqhlfmcjrieosarjwcjd.supabase.co";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey || "");

// Add this route to your Express app
app.post("/api/assessments", async (req, res) => {
  try {
    const {
      fullName,
      email,
      age,
      phone,
      heartCondition,
      chestPain,
      dizziness,
      jointPain,
      localizedPain,
      numbnessTingling,
      unexplainedChanges,
      injuryHistory,
      currentInjuries,
      lefsSquatting,
      lefsWalking,
      lefsShoes,
      lefsLifting,
      lefsStairs,
      lefsHopping,
      workHours,
      occupationalActivity,
      stressLevel,
      sleepHours,
      energyLevel,
      dietNotes,
      eatingTriggers,
      motivation,
      successDefinition,
      confidenceLevel,
      derailingFactors,
      recommendedTier,
      tierConfidence,
    } = req.body;

    // Validate required fields
    if (!fullName || !email) {
      return res.status(400).json({ error: "Name and email required" });
    }

    // Save to Supabase
    const { data, error } = await supabase
      .from("assessments")
      .upsert(
        [
          {
            full_name: fullName,
            email: email,
            age: parseInt(age) || null,
            phone: phone || null,
            heart_condition: heartCondition || false,
            chest_pain: chestPain || false,
            dizziness: dizziness || false,
            joint_pain: jointPain || false,
            localized_pain: localizedPain || false,
            numbness_tingling: numbnessTingling || false,
            unexplained_changes: unexplainedChanges || false,
            injury_history: injuryHistory || null,
            current_injuries: currentInjuries || null,
            lefs_squatting: parseInt(lefsSquatting) || null,
            lefs_walking: parseInt(lefsWalking) || null,
            lefs_shoes: parseInt(lefsShoes) || null,
            lefs_lifting: parseInt(lefsLifting) || null,
            lefs_stairs: parseInt(lefsStairs) || null,
            lefs_hopping: parseInt(lefsHopping) || null,
            work_hours: workHours || null,
            occupational_activity: occupationalActivity || null,
            stress_level: stressLevel || null,
            sleep_hours: parseFloat(sleepHours) || null,
            energy_level: energyLevel || null,
            diet_notes: dietNotes || null,
            eating_triggers: eatingTriggers || null,
            motivation: motivation || null,
            success_definition: successDefinition || null,
            confidence_level: parseInt(confidenceLevel) || null,
            derailing_factors: derailingFactors || null,
            recommended_tier: recommendedTier || null,
            tier_confidence: parseFloat(tierConfidence) || null,
            status: "pending",
          },
        ],
        { onConflict: "email" }
      );

    if (error) {
      console.error("Supabase error:", error);
      return res.status(500).json({ error: "Failed to save assessment" });
    }

    // Send confirmation email
    try {
      await resend.emails.send({
        from: "Andrés Sotomayor <onboarding@resend.dev>",
        to: [email],
        subject: `Your Assessment Results - ${recommendedTier} Tier Recommended`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee;">
            <h2 style="color: #1a1a1a;">Assessment Complete, ${fullName.split(' ')[0]}!</h2>
            <p style="color: #333; line-height: 1.6;">
              Based on your assessment, we recommend the <strong>${recommendedTier} Tier</strong> coaching program.
            </p>
            <p style="color: #333; line-height: 1.6;">
              This tier is customized to your current state, goals, and needs. Once you sign up, we'll complete the full intake form and start building your personalized protocol immediately.
            </p>
            <p style="margin-top: 30px; color: #666; font-size: 0.9em;">
              Andrés Sotomayor<br>
              Founder of ISA | Integrated Strength Athletes
            </p>
          </div>
        `,
      });
    } catch (emailErr) {
      console.error("Email error (non-blocking):", emailErr);
    }

    res.json({
      success: true,
      tier: recommendedTier,
      confidence: tierConfidence,
    });
  } catch (err) {
    console.error("Assessment error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});
