import React from 'react';
import { Card, CardBody, CardHeader } from '../../components/common/Card';

export const SuperAdminDashboard: React.FC = () => {
  return (
    <div className="min-h-screen p-6 bg-slate-900 text-white">
      <h1 className="text-3xl font-bold mb-6 text-slate-100">💻 Super Admin - Monitoring Technique</h1>
      
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-slate-800 border-slate-700 text-white">
          <CardHeader className="text-slate-300 border-b border-slate-700">État des Serveurs</CardHeader>
          <CardBody>
            <div className="flex justify-between mb-2">
              <span>API Backend</span>
              <span className="text-green-400 font-mono">UP 99.9%</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Base de données</span>
              <span className="text-green-400 font-mono">UP 99.9%</span>
            </div>
            <div className="flex justify-between">
              <span>Passerelle SMS (USSD)</span>
              <span className="text-yellow-400 font-mono">DEGRADED</span>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-slate-800 border-slate-700 text-white">
          <CardHeader className="text-slate-300 border-b border-slate-700">Ressources Système</CardHeader>
          <CardBody>
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span>CPU</span>
                <span>45%</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '45%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>RAM</span>
                <span>80%</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div className="bg-red-500 h-2 rounded-full" style={{ width: '80%' }}></div>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-slate-800 border-slate-700 text-white">
          <CardHeader className="text-slate-300 border-b border-slate-700">Logs Récents</CardHeader>
          <CardBody className="font-mono text-xs text-slate-400 space-y-2">
            <p>[12:04:01] INFO: SMS sent to 034XXXXXXX</p>
            <p>[12:03:45] WARN: USSD Gateway timeout</p>
            <p>[12:02:10] INFO: New user registration (role: acheteur)</p>
            <p>[12:00:00] INFO: Daily DB backup completed</p>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};
