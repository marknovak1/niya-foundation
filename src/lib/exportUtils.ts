/**
 * Utility functions for exporting data to CSV
 */

export const exportToCSV = <T extends object>(
  data: T[],
  filename: string,
  columns?: { key: keyof T; label: string }[]
) => {
  if (data.length === 0) {
    console.warn("No data to export");
    return;
  }

  // Determine columns to export
  const exportColumns = columns || Object.keys(data[0]).map(key => ({
    key: key as keyof T,
    label: key.toString()
  }));

  // Create CSV header
  const header = exportColumns.map(col => `"${col.label}"`).join(",");

  // Create CSV rows
  const rows = data.map(item => {
    return exportColumns.map(col => {
      const value = item[col.key];
      if (value === null || value === undefined) {
        return '""';
      }
      if (typeof value === 'object') {
        return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
      }
      return `"${String(value).replace(/"/g, '""')}"`;
    }).join(",");
  });

  // Combine header and rows
  const csv = [header, ...rows].join("\n");

  // Create and trigger download
  const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  
  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = "hidden";
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Predefined column configurations for different data types
export const contactSubmissionsColumns = [
  { key: "name" as const, label: "Name" },
  { key: "email" as const, label: "Email" },
  { key: "phone" as const, label: "Phone" },
  { key: "subject" as const, label: "Subject" },
  { key: "inquiry_type" as const, label: "Inquiry Type" },
  { key: "message" as const, label: "Message" },
  { key: "status" as const, label: "Status" },
  { key: "newsletter_optin" as const, label: "Newsletter Opt-in" },
  { key: "created_at" as const, label: "Submitted At" },
];

export const newsletterColumns = [
  { key: "email" as const, label: "Email" },
  { key: "name" as const, label: "Name" },
  { key: "segment" as const, label: "Segment" },
  { key: "subscriber_type" as const, label: "Type" },
  { key: "interests" as const, label: "Interests" },
  { key: "is_active" as const, label: "Active" },
  { key: "created_at" as const, label: "Subscribed At" },
];

export const membershipColumns = [
  { key: "first_name" as const, label: "First Name" },
  { key: "last_name" as const, label: "Last Name" },
  { key: "email" as const, label: "Email" },
  { key: "phone" as const, label: "Phone" },
  { key: "membership_tier" as const, label: "Tier" },
  { key: "organization" as const, label: "Organization" },
  { key: "city" as const, label: "City" },
  { key: "country" as const, label: "Country" },
  { key: "interests" as const, label: "Interests" },
  { key: "status" as const, label: "Status" },
  { key: "created_at" as const, label: "Registered At" },
];

export const surveyColumns = [
  { key: "survey_type" as const, label: "Survey Type" },
  { key: "respondent_name" as const, label: "Respondent Name" },
  { key: "respondent_email" as const, label: "Respondent Email" },
  { key: "responses" as const, label: "Responses" },
  { key: "created_at" as const, label: "Submitted At" },
];

export const eventRegistrationColumns = [
  { key: "name" as const, label: "Name" },
  { key: "email" as const, label: "Email" },
  { key: "phone" as const, label: "Phone" },
  { key: "notes" as const, label: "Notes" },
  { key: "status" as const, label: "Status" },
  { key: "created_at" as const, label: "Registered At" },
];
