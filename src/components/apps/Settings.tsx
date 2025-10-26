import React, { useState, useEffect } from 'react';
import { Monitor, Wifi, Bluetooth, Volume2, Battery, Palette } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

export const Settings: React.FC = () => {
  const [brightness, setBrightness] = useState([80]);

  useEffect(() => {
    const savedBrightness = localStorage.getItem('screen_brightness');
    if (savedBrightness) {
      setBrightness([parseInt(savedBrightness)]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('screen_brightness', brightness[0].toString());
    document.documentElement.style.filter = `brightness(${brightness[0]}%)`;
    
    return () => {
      document.documentElement.style.filter = '';
    };
  }, [brightness]);

  return (
    <div className="h-full overflow-auto p-6 bg-gradient-to-br from-background to-muted/20">
      <h2 className="text-2xl font-bold mb-6 terminal-glow">System Settings</h2>

      <div className="space-y-6">
        {/* Display Settings */}
        <div className="glass-strong rounded-lg p-6 space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <Monitor className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold">Display</h3>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <Label>Brightness</Label>
                <span className="text-sm text-muted-foreground">{brightness[0]}%</span>
              </div>
              <Slider
                value={brightness}
                max={100}
                step={1}
                onValueChange={setBrightness}
                className="cursor-pointer"
              />
              <p className="text-xs text-muted-foreground mt-2">
                Adjust screen brightness (actually works!)
              </p>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2">
                <Palette className="w-4 h-4 text-muted-foreground" />
                <Label>Dark Mode</Label>
              </div>
              <Switch checked disabled />
            </div>
          </div>
        </div>

        {/* Network Settings */}
        <div className="glass-strong rounded-lg p-6 space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <Wifi className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold">Network</h3>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Wi-Fi</p>
                <p className="text-sm text-muted-foreground">Connected to DevOps-Network</p>
              </div>
              <Switch checked disabled />
            </div>

            <div className="glass-strong rounded p-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Network:</span>
                <span className="font-mono">DevOps-Network</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Signal:</span>
                <span className="text-primary">Excellent</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">IP Address:</span>
                <span className="font-mono">192.168.1.100</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bluetooth Settings */}
        <div className="glass-strong rounded-lg p-6 space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <Bluetooth className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold">Bluetooth</h3>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Bluetooth</p>
              <p className="text-sm text-muted-foreground">No devices connected</p>
            </div>
            <Switch disabled />
          </div>

          <div className="glass-strong rounded p-3 text-sm text-center text-muted-foreground">
            Turn on Bluetooth to connect to devices
          </div>
        </div>

        {/* Sound Settings */}
        <div className="glass-strong rounded-lg p-6 space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <Volume2 className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold">Sound</h3>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <Label>System Volume</Label>
              <span className="text-sm text-muted-foreground">75%</span>
            </div>
            <Slider
              value={[75]}
              max={100}
              step={1}
              disabled
              className="cursor-not-allowed opacity-50"
            />
          </div>
        </div>

        {/* System Info */}
        <div className="glass-strong rounded-lg p-6 space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <Battery className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold">System Information</h3>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">OS:</span>
              <span>Ubuntu 22.04 LTS</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Kernel:</span>
              <span className="font-mono">5.15.0-91-generic</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Memory:</span>
              <span>8192 MB / 16384 MB</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Disk:</span>
              <span>120 GB / 500 GB</span>
            </div>
          </div>
        </div>

        <div className="text-center text-xs text-muted-foreground pt-4 pb-2">
          <p>* Only brightness control is functional in this demo</p>
        </div>
      </div>
    </div>
  );
};
