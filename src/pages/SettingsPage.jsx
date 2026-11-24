import { useState } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import useDocumentTitle from "../hooks/useDocumentTitle";
const defaultSettings = {
  displayName: "",
  studyDuration: 25,
  compactMode: false,
};

function SettingsPage() {
  	useDocumentTitle("Settings");
  const [savedSettings, setSavedSettings] = useLocalStorage(
    "studyflow-settings",
    defaultSettings,
  );

  const [settings, setSettings] = useState(savedSettings);

  // Update one setting while keeping the others
  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setSettings((previousSettings) => ({
      ...previousSettings,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Save settings to localStorage
  const handleSubmit = (event) => {
    event.preventDefault();

    setSavedSettings({
      ...settings,
      studyDuration: Number(settings.studyDuration),
    });

    alert("Your settings have been saved!");
  };

  // Restore the default settings
  const handleReset = () => {
    setSettings(defaultSettings);
    setSavedSettings(defaultSettings);
  };

  return (
    <div className="min-h-screen bg-[#F7F4EF]">
      <div className="mx-auto max-w-5xl space-y-8">
        {/* Page heading */}
        <div>
          <p className="text-sm font-medium tracking-wider text-[#806A91]">
            PERSONALIZE YOUR EXPERIENCE
          </p>

          <h1 className="mt-2 text-3xl font-bold text-[#3B3044]">Settings</h1>

          <p className="mt-2 text-[#938B94]">
            Manage your preferences and customize your study workspace.
          </p>
        </div>

        {/* Settings form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-8 rounded-2xl bg-white p-6 shadow-sm sm:p-8"
        >
          {/* Display name */}
          <div>
            <h2 className="text-lg font-semibold text-[#3B3044]">
              Profile Information
            </h2>

            <p className="mt-1 text-sm text-[#938B94]">
              Choose how you would like to be addressed.
            </p>

            <label
              htmlFor="displayName"
              className="mt-5 block text-sm font-medium text-[#3B3044]"
            >
              Display Name
            </label>

            <input
              id="displayName"
              type="text"
              name="displayName"
              value={settings.displayName}
              onChange={handleChange}
              placeholder="Enter your display name"
              maxLength={40}
              className="mt-2 w-full rounded-xl border border-[#E5DDE8] px-4 py-3 text-[#3B3044] outline-none transition focus:border-[#806A91] focus:ring-2 focus:ring-[#EAE2F1]"
            />
          </div>

          <div className="border-t border-[#EEE8EF]" />

          {/* Study duration */}
          <div>
            <h2 className="text-lg font-semibold text-[#3B3044]">
              Study Preferences
            </h2>

            <p className="mt-1 text-sm text-[#938B94]">
              Set the duration you prefer for each study session.
            </p>

            <label
              htmlFor="studyDuration"
              className="mt-5 block text-sm font-medium text-[#3B3044]"
            >
              Preferred Study Duration
            </label>

            <select
              id="studyDuration"
              name="studyDuration"
              value={settings.studyDuration}
              onChange={handleChange}
              className="mt-2 w-full rounded-xl border border-[#E5DDE8] bg-white px-4 py-3 text-[#3B3044] outline-none transition focus:border-[#806A91] focus:ring-2 focus:ring-[#EAE2F1] sm:max-w-xs"
            >
              <option value={15}>15 minutes</option>
              <option value={25}>25 minutes</option>
              <option value={30}>30 minutes</option>
              <option value={45}>45 minutes</option>
              <option value={60}>60 minutes</option>
            </select>
          </div>

          <div className="border-t border-[#EEE8EF]" />

          {/* UI preference */}
          <div>
            <h2 className="text-lg font-semibold text-[#3B3044]">Appearance</h2>

            <p className="mt-1 text-sm text-[#938B94]">
              Customize how your workspace is displayed.
            </p>

            <label className="mt-5 flex cursor-pointer items-center justify-between gap-4 rounded-xl bg-[#F7F4EF] p-4">
              <div>
                <span className="font-medium text-[#3B3044]">Compact Mode</span>

                <p className="mt-1 text-sm text-[#938B94]">
                  Use smaller spacing throughout your workspace.
                </p>
              </div>

              <input
                type="checkbox"
                name="compactMode"
                checked={settings.compactMode}
                onChange={handleChange}
                className="h-5 w-5 accent-[#806A91]"
              />
            </label>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-3 border-t border-[#EEE8EF] pt-6">
            <button
              type="submit"
              className="rounded-xl bg-[#3B3044] px-7 py-3 font-medium text-white transition hover:bg-[#51415D]"
            >
              Save Settings
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="rounded-xl border border-[#D9C9EF] px-7 py-3 font-medium text-[#3B3044] transition hover:bg-[#F7F4EF]"
            >
              Reset Defaults
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SettingsPage;
