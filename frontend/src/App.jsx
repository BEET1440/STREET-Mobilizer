import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { LayoutDashboard, UserPlus, Search, LogOut, ShieldCheck, Database, AlertCircle, CheckCircle2 } from 'lucide-react';

// Mock components (will implement properly later)
const Dashboard = () => (
  <div className="p-6">
    <h1 className="text-3xl font-bold mb-6">Analytics Dashboard</h1>
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-blue-500">
        <h3 className="text-gray-500 text-sm font-medium">Total Registered</h3>
        <p className="text-3xl font-bold">124</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-red-500">
        <h3 className="text-gray-500 text-sm font-medium">Missing Matches</h3>
        <p className="text-3xl font-bold text-red-600">12</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-green-500">
        <h3 className="text-gray-500 text-sm font-medium">Verified Records</h3>
        <p className="text-3xl font-bold">124</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-yellow-500">
        <h3 className="text-gray-500 text-sm font-medium">Blockchain Txns</h3>
        <p className="text-3xl font-bold">1,402</p>
      </div>
    </div>
    
    <div className="mt-10 bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Recent Activity</h2>
        <span className="text-xs font-medium text-red-600 bg-red-100 px-2 py-1 rounded-full animate-pulse">Live AI Monitoring</span>
      </div>
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Missing Check</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Blockchain Hash</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          <tr>
            <td className="px-6 py-4 whitespace-nowrap font-medium">John Doe</td>
            <td className="px-6 py-4 whitespace-nowrap"><span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Verified</span></td>
            <td className="px-6 py-4 whitespace-nowrap"><span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">No Match</span></td>
            <td className="px-6 py-4 whitespace-nowrap font-mono text-xs">0x7a2...f4e</td>
          </tr>
          <tr>
            <td className="px-6 py-4 whitespace-nowrap font-medium">Samuel Omondi</td>
            <td className="px-6 py-4 whitespace-nowrap"><span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Verified</span></td>
            <td className="px-6 py-4 whitespace-nowrap"><span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Gov DB Match</span></td>
            <td className="px-6 py-4 whitespace-nowrap font-mono text-xs">0x3c1...b2d</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
);

const Registration = () => {
  const [matchAlert, setMatchAlert] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call to register
    setTimeout(() => {
      const name = e.target.elements[0].value;
      setIsSubmitting(false);
      
      // Simulate a match for testing (e.g., if name is Samuel Omondi)
      if (name.toLowerCase().includes('samuel')) {
        setMatchAlert({
          source: 'Government Missing Persons API',
          confidence: '98%',
          originalName: 'Samuel Omondi',
          contact: '+254 700 123456'
        });
      } else {
        setIsSuccess(true);
      }
    }, 2000);
  };

  if (isSuccess) {
    return (
      <div className="p-6 max-w-2xl mx-auto text-center">
        <CheckCircle2 className="mx-auto h-20 w-20 text-green-500 mb-4" />
        <h1 className="text-3xl font-bold mb-2">Registration Successful</h1>
        <p className="text-gray-600 mb-6">The record has been securely added to the blockchain.</p>
        <button onClick={() => setIsSuccess(false)} className="bg-blue-600 text-white px-6 py-2 rounded-md font-bold">Register Another</button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Register New Record</h1>
      
      {matchAlert && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-6 rounded-md shadow-sm animate-bounce">
          <div className="flex items-center gap-3 text-red-800 mb-2">
            <AlertCircle className="h-6 w-6" />
            <h2 className="text-lg font-bold">AI MATCH ALERT: POTENTIAL MISSING CHILD</h2>
          </div>
          <p className="text-red-700 text-sm mb-4">
            Our Face Recognition AI has found a high-confidence match in the <strong>{matchAlert.source}</strong>.
          </p>
          <div className="bg-white p-4 rounded border border-red-200 grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="block text-gray-500 uppercase text-xs font-bold">Original Name</span>
              <span className="font-bold">{matchAlert.originalName}</span>
            </div>
            <div>
              <span className="block text-gray-500 uppercase text-xs font-bold">Match Confidence</span>
              <span className="font-bold text-green-600">{matchAlert.confidence}</span>
            </div>
            <div className="col-span-2">
              <span className="block text-gray-500 uppercase text-xs font-bold">Parent/Guardian Contact</span>
              <span className="font-bold">{matchAlert.contact}</span>
            </div>
          </div>
          <div className="mt-4 flex gap-3">
            <button className="flex-1 bg-red-600 text-white py-2 rounded font-bold hover:bg-red-700 transition">Alert Authorities</button>
            <button onClick={() => setMatchAlert(null)} className="flex-1 bg-gray-200 text-gray-800 py-2 rounded font-bold hover:bg-gray-300 transition">Dismiss</button>
          </div>
        </div>
      )}

      <form className="bg-white p-8 rounded-lg shadow-md space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium text-gray-700">Full Name</label>
          <input type="text" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" placeholder="Child's name" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Age</label>
            <input type="number" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
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
          <input type="text" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" placeholder="Street, City" />
        </div>
        <div className="border-2 border-dashed border-blue-200 p-6 rounded-lg text-center bg-blue-50">
          <ShieldCheck className="mx-auto h-12 w-12 text-blue-500 mb-2" />
          <p className="text-sm text-blue-700 font-medium">Face Biometrics & Fingerprint Extraction</p>
          <p className="text-xs text-blue-500 mb-4">AI will automatically check missing persons databases</p>
          <button type="button" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">Start AI Capture</button>
        </div>
        <button 
          type="submit" 
          disabled={isSubmitting}
          className={`w-full font-bold py-3 rounded-md transition duration-300 flex justify-center items-center gap-2 ${isSubmitting ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
        >
          {isSubmitting ? 'AI Matching & Blockchain Linking...' : 'Submit to Blockchain'}
        </button>
      </form>
    </div>
  );
};

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
