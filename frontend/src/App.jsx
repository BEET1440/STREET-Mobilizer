import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { LayoutDashboard, UserPlus, Search, LogOut, ShieldCheck, Database } from 'lucide-react';

// Mock components (will implement properly later)
const Dashboard = () => (
  <div className="p-6">
    <h1 className="text-3xl font-bold mb-6">Analytics Dashboard</h1>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-blue-500">
        <h3 className="text-gray-500 text-sm font-medium">Total Registered</h3>
        <p className="text-3xl font-bold">124</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-green-500">
        <h3 className="text-gray-500 text-sm font-medium">Verified Records</h3>
        <p className="text-3xl font-bold">124</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-yellow-500">
        <h3 className="text-gray-500 text-sm font-medium">Blockchain Transactions</h3>
        <p className="text-3xl font-bold">1,402</p>
      </div>
    </div>
    
    <div className="mt-10 bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Blockchain Hash</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          <tr>
            <td className="px-6 py-4 whitespace-nowrap">John Doe</td>
            <td className="px-6 py-4 whitespace-nowrap"><span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Verified</span></td>
            <td className="px-6 py-4 whitespace-nowrap font-mono text-xs">0x7a2...f4e</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
);

const Registration = () => (
  <div className="p-6 max-w-2xl mx-auto">
    <h1 className="text-3xl font-bold mb-6">Register New Record</h1>
    <form className="bg-white p-8 rounded-lg shadow-md space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Full Name</label>
        <input type="text" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" placeholder="Child's name" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Age</label>
          <input type="number" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Gender</label>
          <select className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Location Found</label>
        <input type="text" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" placeholder="Street, City" />
      </div>
      <div className="border-2 border-dashed border-blue-200 p-6 rounded-lg text-center bg-blue-50">
        <ShieldCheck className="mx-auto h-12 w-12 text-blue-500 mb-2" />
        <p className="text-sm text-blue-700">Biometric Authentication Required</p>
        <button type="button" className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Scan Fingerprint</button>
      </div>
      <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-md hover:bg-blue-700 transition duration-300">Submit to Blockchain</button>
    </form>
  </div>
);

const Verification = () => (
  <div className="p-6 max-w-2xl mx-auto">
    <h1 className="text-3xl font-bold mb-6">Record Verification</h1>
    <div className="bg-white p-8 rounded-lg shadow-md text-center">
      <Search className="mx-auto h-16 w-16 text-gray-400 mb-4" />
      <h2 className="text-xl font-medium mb-2">Scan Biometrics to Retrieve Record</h2>
      <p className="text-gray-500 mb-6">This will search the blockchain for an existing record matching the biometric template.</p>
      <button className="bg-blue-600 text-white px-8 py-3 rounded-md font-bold hover:bg-blue-700">Start Scan</button>
    </div>
  </div>
);

const Login = ({ setAuth }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-100">
    <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-xl">
      <div className="text-center mb-8">
        <Database className="mx-auto h-12 w-12 text-blue-600" />
        <h2 className="text-3xl font-extrabold text-gray-900 mt-2">STREET Mobilizer</h2>
        <p className="text-gray-600">Secure Blockchain Data Portal</p>
      </div>
      <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setAuth(true); }}>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email Address</label>
          <input type="email" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3" defaultValue="admin@street.org" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input type="password" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3" defaultValue="password123" />
        </div>
        <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          Sign In
        </button>
      </form>
    </div>
  </div>
);

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  if (!isAuthenticated) {
    return <Login setAuth={setIsAuthenticated} />;
  }

  return (
    <Router>
      <div className="flex min-h-screen bg-gray-100">
        {/* Sidebar */}
        <div className="w-64 bg-blue-900 text-white shadow-lg">
          <div className="p-6">
            <h1 className="text-xl font-bold flex items-center gap-2">
              <Database size={24} /> STREET Mobilizer
            </h1>
          </div>
          <nav className="mt-6">
            <Link to="/" className="flex items-center gap-3 px-6 py-4 hover:bg-blue-800 transition">
              <LayoutDashboard size={20} /> Dashboard
            </Link>
            <Link to="/register" className="flex items-center gap-3 px-6 py-4 hover:bg-blue-800 transition">
              <UserPlus size={20} /> Register Child
            </Link>
            <Link to="/verify" className="flex items-center gap-3 px-6 py-4 hover:bg-blue-800 transition">
              <Search size={20} /> Verify Record
            </Link>
            <button 
              onClick={() => setIsAuthenticated(false)}
              className="w-full flex items-center gap-3 px-6 py-4 hover:bg-red-800 transition mt-auto"
            >
              <LogOut size={20} /> Logout
            </button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <header className="bg-white shadow-sm p-4 flex justify-between items-center">
            <span className="text-gray-600 font-medium">Welcome, Authorized Personnel</span>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 bg-green-500 rounded-full"></span>
              <span className="text-xs text-gray-500">Blockchain Node: Active</span>
            </div>
          </header>
          
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/register" element={<Registration />} />
            <Route path="/verify" element={<Verification />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
