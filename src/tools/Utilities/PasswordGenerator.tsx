import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Copy, Check, RefreshCw } from "lucide-react";

export default function PasswordGenerator() {
  const { t } = useTranslation();
  const [password, setPassword] = useState("");
  const [length, setLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [copied, setCopied] = useState(false);

  const generatePassword = () => {
    let charset = "";
    if (includeUppercase) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (includeLowercase) charset += "abcdefghijklmnopqrstuvwxyz";
    if (includeNumbers) charset += "0123456789";
    if (includeSymbols) charset += "!@#$%^&*()_+~`|}{[]:;?><,./-=";

    if (charset === "") {
      setPassword("");
      return;
    }

    let newPassword = "";
    for (let i = 0, n = charset.length; i < length; ++i) {
      newPassword += charset.charAt(Math.floor(Math.random() * n));
    }
    setPassword(newPassword);
    setCopied(false);
  };

  useEffect(() => {
    generatePassword();
  }, [
    length,
    includeUppercase,
    includeLowercase,
    includeNumbers,
    includeSymbols,
  ]);

  const copyToClipboard = () => {
    if (!password) return;
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Calculate strength (simple heuristic)
  const strength =
    password.length > 12 &&
    includeUppercase &&
    includeLowercase &&
    includeNumbers &&
    includeSymbols
      ? "Strong"
      : password.length > 8
        ? "Medium"
        : "Weak";
  const strengthColor =
    strength === "Strong"
      ? "text-emerald-600 bg-emerald-100"
      : strength === "Medium"
        ? "text-yellow-600 bg-yellow-100"
        : "text-red-600 bg-red-100";

  return (
    <div className="space-y-8 max-w-xl mx-auto">
      <div className="relative group">
        <input
          type="text"
          value={password}
          readOnly
          className="w-full h-16 px-6 py-4 text-2xl font-mono text-center tracking-wider bg-gray-50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-emerald-500 transition-colors"
        />
        <div className="absolute right-2 top-2 flex gap-2">
          <button
            onClick={generatePassword}
            className="p-3 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors"
            title="Regenerate"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
          <button
            onClick={copyToClipboard}
            className="p-3 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors"
            title={t("common.copy")}
          >
            {copied ? (
              <Check className="w-5 h-5 text-emerald-600" />
            ) : (
              <Copy className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      <div className="flex justify-between items-center px-2">
        <span className="text-sm font-medium text-gray-500">
          Password Strength:
        </span>
        <span
          className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${strengthColor}`}
        >
          {strength}
        </span>
      </div>

      <div className="space-y-6 bg-white border border-gray-200 p-6 rounded-2xl shadow-sm">
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">
              Password Length
            </label>
            <span className="text-sm font-bold text-emerald-600">{length}</span>
          </div>
          <input
            type="range"
            min="4"
            max="64"
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
          {[
            {
              id: "uppercase",
              label: "Uppercase (A-Z)",
              state: includeUppercase,
              setter: setIncludeUppercase,
            },
            {
              id: "lowercase",
              label: "Lowercase (a-z)",
              state: includeLowercase,
              setter: setIncludeLowercase,
            },
            {
              id: "numbers",
              label: "Numbers (0-9)",
              state: includeNumbers,
              setter: setIncludeNumbers,
            },
            {
              id: "symbols",
              label: "Symbols (!@#$)",
              state: includeSymbols,
              setter: setIncludeSymbols,
            },
          ].map((option) => (
            <label
              key={option.id}
              className="flex items-center gap-3 cursor-pointer p-3 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <input
                type="checkbox"
                checked={option.state}
                onChange={(e) => option.setter(e.target.checked)}
                className="w-5 h-5 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
              />
              <span className="text-gray-700 font-medium">{option.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
