import React, { useState, useEffect } from 'react';
import { adminApi } from '../api';
import PageHeader from '../../../components/data/PageHeader';
import FormField from '../../../components/ui/FormField';
import Input from '../../../components/ui/Input';
import Checkbox from '../../../components/ui/Checkbox';
import Button from '../../../components/ui/Button';
import Spinner from '../../../components/feedback/Spinner';
import { useToast } from '../../../components/ui/Toast';

export default function AlertSettings() {
  const { addToast } = useToast();
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const data = await adminApi.getAlertSettings();
        setSettings(data);
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, []);

  const handleReminderChange = (index, value) => {
    const newReminders = [...settings.reminderDays];
    newReminders[index] = Number(value) || 0;
    setSettings((p) => ({ ...p, reminderDays: newReminders }));
  };

  const handleChannelToggle = (channel) => {
    setSettings((p) => ({
      ...p,
      channels: {
        ...p.channels,
        [channel]: !p.channels[channel],
      },
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await adminApi.updateAlertSettings(settings);
      addToast('Alert & escalation parameters saved on ledger.', 'success');
    } catch (err) {
      addToast(err.message || 'Saving failed', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <PageHeader
        title="Alert & reminder settings"
        description="Configure automated maturity notification schedules, escalation triggers, and dispatch channels"
      />

      <form onSubmit={handleSave} className="space-y-6 bg-white dark:bg-[#0f172a] border border-hairline dark:border-slate-800 rounded-xl p-6 shadow-xs">
        {/* Reminder Threshold Intervals */}
        <div>
          <h2 className="text-sm font-semibold text-gray-900 dark:text-slate-100 mb-1">
            Maturity reminder thresholds (days prior to maturity)
          </h2>
          <p className="text-xs text-gray-500 dark:text-slate-400 mb-3">
            Automated alerts sent to institute principal and registered finance email.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {settings?.reminderDays?.map((days, idx) => (
              <FormField key={idx} label={`Stage ${idx + 1}`}>
                <div className="flex items-center gap-1.5">
                  <Input
                    type="number"
                    value={days}
                    onChange={(e) => handleReminderChange(idx, e.target.value)}
                  />
                  <span className="text-xs text-gray-500">days</span>
                </div>
              </FormField>
            ))}
          </div>
        </div>

        <div className="form-divider" />

        {/* Escalation Rules */}
        <div>
          <h2 className="text-sm font-medium text-gray-900 mb-1">Escalation protocol</h2>
          <p className="text-xs text-gray-500 mb-3">
            Automatically escalate to regional officer when an institution leaves reminders unacknowledged.
          </p>

          <div className="max-w-xs">
            <FormField label="Escalate after unacknowledged days">
              <div className="flex items-center gap-1.5">
                <Input
                  type="number"
                  value={settings?.escalateAfterDays || 7}
                  onChange={(e) =>
                    setSettings((p) => ({ ...p, escalateAfterDays: Number(e.target.value) }))
                  }
                />
                <span className="text-xs text-gray-500">days</span>
              </div>
            </FormField>
          </div>
        </div>

        <div className="form-divider" />

        {/* Channel Toggles */}
        <div>
          <h2 className="text-sm font-medium text-gray-900 mb-1">Dispatch communication channels</h2>
          <p className="text-xs text-gray-500 mb-3">Enable or disable statutory notice transport channels.</p>

          <div className="space-y-2">
            <div>
              <Checkbox
                checked={settings?.channels?.email || false}
                onChange={() => handleChannelToggle('email')}
                label="Official registered email address (SMTP Gateway)"
              />
            </div>
            <div>
              <Checkbox
                checked={settings?.channels?.sms || false}
                onChange={() => handleChannelToggle('sms')}
                label="SMS urgent broadcast to designated mobile"
              />
            </div>
            <div>
              <Checkbox
                checked={settings?.channels?.portal || false}
                onChange={() => handleChannelToggle('portal')}
                label="Institution dashboard action banner"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-hairline flex justify-end">
          <Button type="submit" variant="primary" disabled={isSaving}>
            {isSaving ? 'Saving parameters...' : 'Save settings'}
          </Button>
        </div>
      </form>
    </div>
  );
}
