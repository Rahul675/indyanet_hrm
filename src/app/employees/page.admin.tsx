"use client";
import React, { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Users,
  X,
  ChevronDown,
  ChevronUp,
  UserPlus,
  Building2,
  Briefcase,
  GraduationCap,
  Mail,
  Phone,
  MapPin,
  Calendar,
  User,
} from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/store/auth";
import { useTheme } from "@/context/ThemeProvider";

/* -------------------------------------------
   Employee Type (attendance fixed)
-------------------------------------------- */
type Employee = {
  id: string;
  personNo: string;
  firstName: string;
  lastName: string;
  workEmail: string;
  personalEmail?: string;
  phone?: string;
  emergencyContact?: string;
  gender?: string;
  address?: string;
  educationQualification?: string;
  birthdate?: string;
  department?: string;
  location?: string;
  status: string;
  hireDate: string;
  manager?: {
    id: string;
    firstName: string;
    lastName: string;
  };
  attendance?: {
    date?: string;
    checkInTime?: string;
    checkOutTime?: string;
  } | null; // ✅ FIXED — attendance is a single object or null
  compensation?: {
    baseSalary: number;
    currency: string;
  };
  documents?: {
    id: string;
    title: string;
    type: string;
    storageUrl: string;
    uploadedBy?: string;
    signedAt?: string;
    expiryDate?: string;
  }[];
};

/* ----------------------------- */
const FormField = ({
  label,
  required = false,
  children,
  error,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  error?: string;
}) => (
  <div className="space-y-2">
    <label className="flex items-center text-sm font-semibold text-[var(--text-primary)]">
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
    {children}
    {error && <p className="text-xs text-red-500">{error}</p>}
  </div>
);

const Input = ({ className = "", error = false, ...props }: any) => (
  <input
    className={`w-full px-4 py-3 rounded-xl text-[var(--text-primary)] bg-[var(--input-bg)] border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500
      ${error ? "border-red-500" : "border-[var(--border-color)] hover:border-blue-400"} ${className}`}
    {...props}
  />
);

const Select = ({ children, className = "", error = false, ...props }: any) => (
  <select
    className={`w-full px-4 py-3 rounded-xl text-[var(--text-primary)] bg-[var(--input-bg)] border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500
      ${error ? "border-red-500" : "border-[var(--border-color)] hover:border-blue-400"} ${className}`}
    {...props}
  >
    {children}
  </select>
);

const StatsCard = ({ icon: Icon, label, value, change, trend }: any) => (
  <div className="rounded-2xl p-6 border border-[var(--border-color)] bg-[var(--card-bg)] shadow-sm transition-colors hover:bg-[var(--hover-bg)] duration-200">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-blue-500/10 rounded-xl">
          <Icon className="w-6 h-6 text-blue-500" />
        </div>
        <div>
          <p className="text-sm font-medium text-[var(--text-muted)]">
            {label}
          </p>
          <p className="text-2xl font-bold text-[var(--text-primary)]">
            {value}
          </p>
        </div>
      </div>
      {change && (
        <div
          className={`text-sm font-medium ${
            trend === "up" ? "text-green-500" : "text-red-500"
          }`}
        >
          {change}
        </div>
      )}
    </div>
  </div>
);

/* -------------------------------------------
   Main Component
-------------------------------------------- */
export default function EmployeesAdminPage() {
  const { theme } = useTheme();
  const { token } = useAuth();

  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [openRow, setOpenRow] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("all");

  /* -------------------------------------------
     Fetch Employees + Attendance
  -------------------------------------------- */
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const [empRes, attRes] = await Promise.all([
          api.get("/employees", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          api.get("/attendance/today/all", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const attendanceMap = new Map(
          attRes.data.map((a: any) => [a.employeeId, a])
        );

        const merged = empRes.data.map((emp: any) => ({
          ...emp,
          attendance: attendanceMap.get(emp.id) || null,
        }));

        setEmployees(merged);
      } catch (err) {
        console.error("Failed to fetch employees or attendance:", err);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchEmployees();
  }, [token]);

  /* -------------------------------------------
     UI
  -------------------------------------------- */
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)] text-[var(--text-primary)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto mb-4" />
          <p className="text-lg font-medium">Loading employees...</p>
        </div>
      </div>
    );

  /* -------------------------------------------
     Render
  -------------------------------------------- */
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-600 rounded-xl shadow-sm">
              <Users className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[var(--text-primary)]">
                Employee Management
              </h1>
              <p className="text-[var(--text-muted)]">
                Manage your workforce efficiently
              </p>
            </div>
          </div>
        </div>

        {/* Employee Table */}
        <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-[var(--border-color)]">
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">
              Employee Directory
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--border-color)] bg-[var(--hover-bg)]">
                  <th className="text-left px-6 py-4">Employee</th>
                  <th className="text-left px-6 py-4">Contact</th>
                  <th className="text-left px-6 py-4">Department</th>
                  <th className="text-left px-6 py-4">Status</th>
                  <th className="text-left px-6 py-4">Attendance</th>
                  <th></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-color)]">
                {employees.map((employee) => (
                  <React.Fragment key={employee.id}>
                    <tr className="hover:bg-[var(--hover-bg)] transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                            {employee.firstName[0]}
                            {employee.lastName[0]}
                          </div>
                          <div>
                            <p className="font-semibold">
                              {employee.firstName} {employee.lastName}
                            </p>
                            <p className="text-sm text-[var(--text-muted)]">
                              {employee.personNo}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-sm">
                        {employee.workEmail}
                        <br />
                        <span className="text-[var(--text-muted)]">
                          {employee.phone || "—"}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-sm">
                        {employee.department || "—"}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${
                            employee.status === "Active"
                              ? "bg-green-500/10 text-green-600"
                              : "bg-red-500/10 text-red-600"
                          }`}
                        >
                          {employee.status}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-sm">
                        {employee.attendance ? (
                          <>
                            <div>
                              <strong>Date:</strong>{" "}
                              {new Date(
                                employee.attendance.date!
                              ).toLocaleDateString([], {
                                year: "numeric",
                                month: "short",
                                day: "2-digit",
                              })}
                            </div>
                            <div>
                              <strong>Check In:</strong>{" "}
                              {employee.attendance.checkInTime
                                ? new Date(
                                    employee.attendance.checkInTime
                                  ).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })
                                : "—"}
                            </div>
                            <div>
                              <strong>Check Out:</strong>{" "}
                              {employee.attendance.checkOutTime
                                ? new Date(
                                    employee.attendance.checkOutTime
                                  ).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })
                                : "—"}
                            </div>
                          </>
                        ) : (
                          <span className="text-gray-500">Not Checked In</span>
                        )}
                      </td>

                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() =>
                            setOpenRow(
                              openRow === employee.id ? null : employee.id
                            )
                          }
                          className="text-blue-600 hover:text-blue-800"
                        >
                          {openRow === employee.id ? (
                            <ChevronUp />
                          ) : (
                            <ChevronDown />
                          )}
                        </button>
                      </td>
                    </tr>
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
