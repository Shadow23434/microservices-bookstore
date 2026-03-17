import { Link } from 'react-router-dom';
import { QrCode, ArrowLeft } from 'lucide-react';
import { useOrders } from '../contexts/OrderContext';

export default function ScanToPay() {
  const { currentOrder } = useOrders();

  if (!currentOrder) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">No pending order found</h2>
          <Link to="/cart" className="text-indigo-600 hover:text-indigo-500 font-medium">Return to Cart</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-md w-full bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 text-center transition-colors">
        <div className="mb-6">
          <Link to="/cart" className="inline-flex items-center text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to Checkout
          </Link>
        </div>
        
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-2">Scan to Pay</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">Open your banking app or digital wallet to scan the QR code below.</p>
        
        <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700 inline-block mb-8 transition-colors">
          <QrCode className="h-48 w-48 text-gray-800 dark:text-gray-200" />
        </div>
        
        <div className="bg-indigo-50 dark:bg-indigo-900/30 rounded-xl p-4 mb-8 transition-colors">
          <p className="text-sm text-indigo-800 dark:text-indigo-300 font-medium">Total Amount</p>
          <p className="text-3xl font-bold text-indigo-900 dark:text-indigo-100">${currentOrder.total.toFixed(2)}</p>
        </div>
        
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          Waiting for payment confirmation...
        </p>
        
        {/* Mocking a successful payment button for demo purposes */}
        <Link 
          to="/order-success" 
          className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-md transition-all"
        >
          Simulate Payment Success
        </Link>
      </div>
    </div>
  );
}
