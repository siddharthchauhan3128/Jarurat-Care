const donations = [
  { donor: "Amit Sharma", amount: 1500, date: "2025-01-05", campaign: "Cancer Treatment" },
  { donor: "Neha Verma", amount: 800, date: "2025-01-10", campaign: "Awareness Drive" },
  { donor: "Rahul Singh", amount: 2500, date: "2025-02-02", campaign: "Chemotherapy Support" },
  { donor: "Priya Desai", amount: 1200, date: "2025-02-18", campaign: "Cancer Treatment" },
  { donor: "Vikas Mehta", amount: 600, date: "2025-03-03", campaign: "Awareness Drive" },
  { donor: "Anjali Patel", amount: 3000, date: "2025-03-16", campaign: "Palliative Care" },
  { donor: "Sanjay Gupta", amount: 2200, date: "2025-04-01", campaign: "Cancer Treatment" },
  { donor: "Ritu Kapoor", amount: 900, date: "2025-04-09", campaign: "Awareness Drive" },
  { donor: "Farhan Ali", amount: 1800, date: "2025-05-21", campaign: "Chemotherapy Support" },
  { donor: "Sneha Rao", amount: 750, date: "2025-05-26", campaign: "Awareness Drive" },
];

function formatCurrency(amount) {
  return "₹" + amount.toLocaleString("en-IN");
}
function cardsCalculation(){
    const totalAmount = donations.reduce((sum,d)=> sum+d.amount , 0);
    const uniqueDonors = new Set(donations.map(d=>d.donor)).size;
    const totalCount = donations.length;
    const avgDonation = totalCount === 0 ? 0 : Math.round(totalAmount / totalCount);
    document.getElementById("totalDonations").textContent = formatCurrency(totalAmount);
  document.getElementById("totalDonors").textContent = uniqueDonors;
  document.getElementById("totalDonationsCount").textContent = totalCount;
  document.getElementById("averageDonation").textContent = formatCurrency(avgDonation);
}
function populateTable() {
  const tbody = document.getElementById("donationTableBody");
  tbody.innerHTML = "";

  // Newest first
  const sorted = [...donations].sort((a, b) => new Date(b.date) - new Date(a.date));

  sorted.forEach((d) => {
    const tr = document.createElement("tr");
    
    const donorTd = document.createElement("td");
    donorTd.textContent = d.donor;

    const amountTd = document.createElement("td");
    amountTd.textContent = d.amount;

    const dateTd = document.createElement("td");
    const date = new Date(d.date);
    dateTd.textContent = date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    const campaignTd = document.createElement("td");
    campaignTd.textContent = d.campaign;

    tr.appendChild(donorTd);
    tr.appendChild(amountTd);
    tr.appendChild(dateTd);
    tr.appendChild(campaignTd);

    tbody.appendChild(tr);
  });
}

// Prepare data for chart: sum amount per month
function getMonthlyTotals() {
  const monthlyMap = new Map(); // key: "YYYY-MM", value: total amount

  donations.forEach((d) => {
    const dt = new Date(d.date);
    const key = dt.getFullYear() + "-" + String(dt.getMonth() + 1).padStart(2, "0");

    if (!monthlyMap.has(key)) {
      monthlyMap.set(key, 0);
    }
    monthlyMap.set(key, monthlyMap.get(key) + d.amount);
  });

  // Convert to sorted arrays
  const entries = Array.from(monthlyMap.entries()).sort((a, b) => (a[0] > b[0] ? 1 : -1));

  const labels = entries.map(([key]) => {
    const [year, month] = key.split("-");
    const dt = new Date(year, Number(month) - 1, 1);
    return dt.toLocaleDateString("en-IN", { month: "short", year: "2-digit" });
  });

  const data = entries.map(([, total]) => total);

  return { labels, data };
}

function renderChart() {
  const ctx = document.getElementById("donationChart").getContext("2d");
  const monthly = getMonthlyTotals();

  new Chart(ctx, {
    type: "line",
    data: {
      labels: monthly.labels,
      datasets: [
        {
          label: "Total Donations (₹)",
          data: monthly.data,
          borderWidth: 2,
          tension: 0.3,
          // Chart.js will use default colors; no need to specify
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: "#e5e7eb",
          },
        },
      },
      scales: {
        x: {
          ticks: { color: "#9ca3af" },
          grid: { display: false },
        },
        y: {
          ticks: { color: "#9ca3af" },
          grid: { color: "#1f2937" },
        },
      },
    },
  });
}

// --------------- Init -----------------
document.addEventListener("DOMContentLoaded", () => {
  cardsCalculation();
  populateTable();
  renderChart();
});
