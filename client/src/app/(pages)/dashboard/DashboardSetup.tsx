import React, { useState, useEffect } from "react";
import { useGetDashboardSummaryQuery } from "@/app/utils/budgetApi";
import { Spinner } from "@/app/components/Spinner";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";
import {
  useGetExpenseHistoryQuery,
  useGetDashboardInsightsQuery,
} from "@/app/utils/budgetApi";
import { format, addDays } from "date-fns";
import { useSearchParams } from "next/navigation";
import { FaXmark } from "react-icons/fa6";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const DashboardSetup = () => {
  // RTK Query
  const {
    data,
    isFetching,
    error,
    refetch: refetchSummary,
  } = useGetDashboardSummaryQuery(undefined, {
    refetchOnMountOrArgChange: true,
  }); // second argument ensures fresh data on page load
  const {
    data: historyData,
    isLoading: loadingHistory,
    error: historyError,
    refetch: refetchHistory,
  } = useGetExpenseHistoryQuery(undefined, { refetchOnMountOrArgChange: true }); // ensures fresh data on page load

  // dashboard insights
  const { data: insights, refetch: refetchInsights } =
    useGetDashboardInsightsQuery(undefined, {
      refetchOnMountOrArgChange: true,
    });

  // fetch updated data
  const searchParams = useSearchParams();
  const shouldRefresh = searchParams.get("refresh") === "true"; // checking to extract the query refresh=true, passed to the dashboard path from the expense page.

  // call the refetch method inside a useEffect
  useEffect(() => {
    if (shouldRefresh) {
      refetchSummary();
      refetchHistory();
      refetchInsights();
    }
  }, [shouldRefresh]);

  const [greeting, setGreeting] = useState("");
  const [expandedDate, setExpandedDate] = useState<string | null>(null);
  // closing suggestions and flags
  const [dismissedSuggestions, setDismissedSuggestions] = useState<string[]>(
    []
  );
  const [dismissedFlags, setDismissedFlags] = useState<string[]>([]);
  const [dismissedTimebasedFeedback, setDismissedTimebasedFeedback] = useState<
    string[]
  >([]);

  // functions to close flags or suggestions
  const handleDismissSuggestion = (msg: string) => {
    setDismissedSuggestions((prev) => [...prev, msg]);
  };

  const handleDismissFlag = (msg: string) => {
    setDismissedFlags((prev) => [...prev, msg]);
  };
  const handleDismissTimebasedFeedback = (msg: string) => {
    setDismissedTimebasedFeedback((prev) => [...prev, msg]);
  };

  // Accessing user from my redux
  const user = useSelector((state: RootState) => state.auth.user);

  // Define a toggle logic to expand/collapse a date section
  const toggleDate = (date: string) => {
    setExpandedDate((prev) => (prev === date ? null : date));
  };

  // time-based greeting
  useEffect(() => {
    // gets the hours of the day (24hrs)
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 16) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  // Convert the dailyspend trend into an array for charting. If not dailySpendTrend, an empty array is returned. (line chart)
  const trendData = data?.data?.dailySpendTrend
    ? Object.entries(data.data.dailySpendTrend).map(([date, amount]) => ({
        date,
        amount,
      }))
    : [];

  // Convert category summary into chartable format, an array of object with name and amount properties (pie chart)
  const allocationData =
    data?.data?.categories?.map((cat) => ({
      name: cat.name,
      value: cat.amount,
    })) || [];

  // define colors for each slice of my pie
  const COLORS = [
    "#7C3AED",
    "#F59E0B",
    "#10B981",
    "#EF4444",
    "#3B82F6",
    "#D946EF",
    "#E11D48", // Rose
    "#0EA5E9", // Sky
  ];

  // Loading state
  if (isFetching) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <Spinner />
      </main>
    );
  }

  // No budget fallback
  if (error || !data?.data) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-600 mb-4">
          You don&apos;t have any budget data to view.
        </p>
        <p className="text-sunPurple font-medium">
          Set up a budget to unlock your dashboard insights.
        </p>
      </div>
    );
  }

  // destructuring these values from the returned data object
  const { status, totalAllocated, totalSpent, remaining, startDate, duration } =
    data?.data;

  // Get budget start and end date formatted
  const formattedStart = format(new Date(startDate), "PPP"); // Formatting budget start date
  const formattedEnd = format(addDays(new Date(startDate), duration), "PPP"); // formatting the end date, obtained by adding duration to start date.

  // extracting filtered feedbacks to ensure tags and title shows only when we have some feedback to display
  const visibleTimeFeedback =
    insights?.timeBasedFeedback?.filter(
      (msg) => !dismissedTimebasedFeedback.includes(msg)
    ) || [];

  const visibleBehaviorFlags =
    insights?.behaviorFlags?.filter((msg) => !dismissedFlags.includes(msg)) ||
    [];

  const visibleSuggestions =
    insights?.suggestions?.filter(
      (msg) => !dismissedSuggestions.includes(msg)
    ) || [];

  return (
    <div className="">
      <div className="bg-gray-800 px-4 py-4">
        <h1 className="sm:text-3xl text-xl font-bold text-amber mb-2">
          {greeting}, {user?.firstName} 👋
        </h1>
        <p className="text-gray-200 mb-6">Dashboard Summary.</p>

        {/* Budget Status */}
        <div className="mb-6">
          <p
            className={`text-lg font-semibold ${
              status === "Expired" ? "text-red-500" : "text-green-500"
            }`}
          >
            Budget Status: {status}
          </p>

          {/* date */}
          <div className="text-sm text-gray-200 my-5">
            <p>
              <strong className="text-amber">Start Date:</strong>{" "}
              {formattedStart}
            </p>
            <p>
              <strong className="text-amber">End Date:</strong> {formattedEnd}
            </p>
          </div>
          <p className="text-sm text-gray-200">
            <span className="text-amber font-semibold">Total Allocated:</span> ₦
            {totalAllocated.toLocaleString()} |{" "}
            <span className="text-amber font-semibold">Spent:</span> ₦
            {totalSpent.toLocaleString()} |{" "}
            <span className="text-amber font-semibold">Remaining:</span> ₦
            {remaining.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Pie Chart for Category Allocation */}
      <div className="mt-10 px-4">
        <h2 className="sm:text-xl text-lg font-bold text-sunPurple mb-4 font-playfair">
          Category Allocation
        </h2>

        <ResponsiveContainer
          width="100%"
          height={300}
          className="no-focus-outline"
        >
          <PieChart>
            <Pie
              data={allocationData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              labelLine={false}
              label={(props) => {
                // Recharts injects this object for each slice
                const { percent, cx, cy, midAngle, outerRadius } = props as {
                  percent: number;
                  cx: number;
                  cy: number;
                  midAngle: number;
                  outerRadius: number;
                };

                // position label inside slice
                const RADIAN = Math.PI / 180;
                const radius = outerRadius * 0.6;
                const x = cx + radius * Math.cos(-midAngle * RADIAN);
                const y = cy + radius * Math.sin(-midAngle * RADIAN);

                return (
                  <text
                    x={x}
                    y={y}
                    fill="white"
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize={12}
                  >
                    {(percent * 100).toFixed(0)}%
                  </text>
                );
              }}
            >
              {allocationData.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => `₦${value.toLocaleString()}`}
            />
            <Legend
              wrapperStyle={{
                marginTop: 40, // adds spacing below the chart
                textAlign: "center", // optional: centers the legend
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <hr className="my-12 px-10 mx-10 border-gray-300" />
      {/* Expense log history by date */}

      <div className="mt-14 px-4">
        <h2 className="sm:text-xl text-lg font-bold text-sunPurple mb-4 font-playfair">
          Expense Log History
        </h2>

        {/* Loading state */}
        {loadingHistory ? (
          <Spinner />
        ) : historyError ||
          !historyData?.data ||
          Object.keys(historyData.data).length === 0 ? (
          <p className="text-gray-500">
            No expenses logged yet. Start tracking to see your history here.
          </p>
        ) : (
          // Grouped logs by date
          <div className="space-y-4">
            {Object.entries(historyData.data)
              .reverse()
              .map(([date, entries]) => (
                <div
                  key={date}
                  className="border rounded-md p-4 bg-white shadow-sm transition-all duration-300"
                >
                  {/* Date header with toggle */}
                  <button
                    onClick={() => toggleDate(date)}
                    className="w-full text-left flex justify-between items-center"
                  >
                    <span className="font-normal text-sunPurple">{date}</span>
                    <span className="text-sm text-gray-500">
                      {expandedDate === date ? "Hide" : "View"} (
                      {entries.length})
                    </span>
                  </button>

                  {/* Entries under the date */}
                  {expandedDate === date && (
                    <ul className="mt-3 space-y-2">
                      {entries.map((entry, idx) => (
                        <li
                          key={idx}
                          className="flex justify-between items-center border-b border-gray-200 pb-2"
                        >
                          <div>
                            <p className="font-medium text-gray-800">
                              {entry.categoryName}
                            </p>
                            <p className="text-sm text-gray-500">
                              ₦{entry.amount.toLocaleString()}{" "}
                              {entry.note && `— ${entry.note}`}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
          </div>
        )}
      </div>

      <hr className="my-12 px-10 mx-10 border-gray-300" />

      {/* Category Progress Bars */}
      <div className="mt-14 px-4">
        <h2 className="sm:text-xl text-lg font-bold text-sunPurple mb-4 font-playfair">
          Category Spending Overview
        </h2>

        <div className="space-y-6">
          {data.data.categories.map((cat, idx) => {
            // Determine bar color based on spending
            let barColor = "bg-green-500";
            if (cat.percentageSpent >= 65 && cat.percentageSpent < 100)
              barColor = "bg-yellow-500";
            if (cat.percentageSpent >= 100) barColor = "bg-red-500";

            return (
              <div key={idx}>
                <div className="flex justify-between items-center mb-1">
                  <p className="font-medium text-gray-700">{cat.name}</p>
                  <p className="text-sm text-gray-500">
                    ₦{cat.spent.toLocaleString()} / ₦
                    {cat.amount.toLocaleString()}
                  </p>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className={`${barColor} h-4 rounded-full transition-all duration-300`}
                    style={{ width: `${Math.min(cat.percentageSpent, 100)}%` }}
                  ></div>
                </div>

                {/* Optional feedback */}
                {cat.percentageSpent > 100 && (
                  <p className="text-sm text-red-600 mt-1">
                    Overspent by ₦{Math.abs(cat.remaining).toLocaleString()}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <hr className="my-12 px-10 mx-10 border-gray-300" />

      {/* Line Chart for Daily Expense Trends */}
      <div className="mt-14 px-4">
        <h2 className="sm:text-xl text-lg font-bold text-sunPurple mb-4 font-playfair">
          Daily Expense Trends
        </h2>

        {/* Responsive container ensures chart scales with screen */}
        <ResponsiveContainer
          width="100%"
          height={300}
          className="no-focus-outline text-gray-800"
        >
          <LineChart data={trendData}>
            {/* Grid lines for readability */}
            <CartesianGrid strokeDasharray="3 3" />

            {/* X-axis shows dates */}
            <XAxis dataKey="date" tick={{ fill: "#1d1160", fontSize: 14 }} />

            {/* Y-axis shows amount spent */}
            <YAxis
              tickFormatter={(value) => `₦${value}`}
              tick={{ fill: "#1d1160" }}
            />

            {/* Tooltip shows exact values on hover */}
            <Tooltip formatter={(value: number) => `₦${value}`} />

            {/* Line with smooth curve */}
            <Line
              type="monotone"
              dataKey="amount"
              stroke="#1d1160"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <hr className="my-8 px-10 mx-10 border-gray-300" />

      {/* Feedback Section */}
      {insights && (
        <div className="mt-14 px-4">
          <h2 className="sm:text-xl text-lg font-bold text-sunPurple mb-4 font-playfair">
            Budget Insights and Personalized Feedbacks
          </h2>

          {/* Health Score */}
          <div className="mb-6">
            <p className="text-sm text-gray-900">
              Overall Budget Health Score:
            </p>
            <p className="text-2xl font-semibold text-sunPurple mt-2">
              {insights.healthScore}/100
            </p>
          </div>
          {visibleTimeFeedback.length > 0 && (
            <div className="mb-4">
              <h3 className="text-md font-semibold text-gray-900 mb-2">
                ⏳ Time-Based Feedback
              </h3>
              <ul className="space-y-2">
                {visibleTimeFeedback.map((msg, idx) => (
                  <li
                    key={idx}
                    className="flex justify-between items-start bg-gray-50 p-3 rounded shadow-sm"
                  >
                    <span className="text-gray-800 text-sm">{msg}</span>
                    <button
                      onClick={() => handleDismissTimebasedFeedback(msg)}
                      className="text-gray-500 hover:text-red-500 text-lg font-bold ml-4"
                      aria-label="Dismiss"
                    >
                      <FaXmark />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {visibleBehaviorFlags.length > 0 && (
            <div className="mb-4">
              <h3 className="text-md font-semibold text-gray-900 mb-2">
                🚩 Behavior Flags
              </h3>
              <ul className="space-y-2">
                {visibleBehaviorFlags.map((msg, idx) => (
                  <li
                    key={idx}
                    className="flex justify-between items-start bg-gray-50 p-3 rounded shadow-sm"
                  >
                    <span className="text-gray-800 text-sm">{msg}</span>
                    <button
                      onClick={() => handleDismissFlag(msg)}
                      className="text-gray-500 hover:text-red-500 text-lg font-bold ml-4"
                      aria-label="Dismiss"
                    >
                      <FaXmark />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {visibleSuggestions.length > 0 && (
            <div className="mb-4">
              <h3 className="text-md font-semibold text-gray-900 mb-2">
                💡 Suggestions
              </h3>
              <ul className="space-y-2">
                {visibleSuggestions.map((msg, idx) => (
                  <li
                    key={idx}
                    className="flex justify-between items-start bg-gray-50 p-3 rounded shadow-sm"
                  >
                    <span className="text-gray-800 text-sm">{msg}</span>
                    <button
                      onClick={() => handleDismissSuggestion(msg)}
                      className="text-gray-500 hover:text-red-500 text-lg font-bold ml-4"
                      aria-label="Dismiss"
                    >
                      <FaXmark />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
      {/* end */}
    </div>
  );
};

export default DashboardSetup;
