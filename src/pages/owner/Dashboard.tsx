import React from 'react';
import { useBoardingHouses } from '../../contexts/BoardingHouseContext';
import ReactECharts from 'echarts-for-react';
import { Home, BedDouble, PlusCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';

const OwnerDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { boardingHouses } = useBoardingHouses();

  // In a real app, you'd filter boardingHouses by the current user/owner.
  // For this simulation, we'll use all of them.

  const totalProperties = boardingHouses.length;
  const totalRooms = boardingHouses.reduce((acc, house) => acc + house.rooms.length, 0);

  const pieChartData = boardingHouses.map(house => ({
    value: house.rooms.length,
    name: house.name,
  })).filter(item => item.value > 0); // Only show properties with rooms in the chart

  const pieChartOptions = {
    title: {
      text: 'Room Distribution',
      subtext: 'Number of rooms per property',
      left: 'center',
      textStyle: {
        color: '#0B0B45',
        fontWeight: 'bold',
      },
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} rooms ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      top: 'middle',
      data: pieChartData.map(d => d.name),
      textStyle: {
        color: '#818080'
      }
    },
    series: [
      {
        name: 'Property',
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['65%', '50%'], // Adjust center to make space for legend
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '20',
            fontWeight: 'bold',
            formatter: '{b}\n{c} rooms'
          }
        },
        labelLine: {
          show: false
        },
        data: pieChartData,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        }
      }
    ],
    color: ['#2C67F2', '#08637C', '#62CFF4', '#3C1BB3', '#000099'] // Colors from theme
  };
  
  if (totalProperties === 0) {
    return (
      <div className="w-full max-w-5xl mx-auto text-center py-16">
        <h1 className="text-4xl sm:text-5xl font-bold text-black mb-4">
          Welcome, {user?.name || 'Owner'}!
        </h1>
        <div className="bg-white rounded-2xl shadow-lg p-12 mt-10 flex flex-col items-center">
            <h3 className="text-2xl font-semibold text-brand-dark-navy">Your Dashboard is Empty</h3>
            <p className="text-gray-500 mt-2 mb-6 max-w-sm">
              You haven't listed any properties yet. Add your first boardinghouse to see your dashboard populate with data.
            </p>
            <Link to="/dashboard/add-new">
              <button className="bg-gradient-add-button text-white font-semibold text-lg py-3 px-8 rounded-full shadow-lg hover:opacity-90 transition-opacity flex items-center gap-2">
                <PlusCircle size={20} />
                Add Your First Property
              </button>
            </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto space-y-10">
      <div>
        <h1 className="text-4xl sm:text-5xl font-bold text-black mb-2">
          Dashboard
        </h1>
        <p className="text-lg text-gray-500">
          Welcome back, {user?.name || 'Owner'}! Here's an overview of your properties.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl shadow-lg p-8 flex items-center justify-between">
          <div>
            <p className="text-lg font-medium text-brand-gray-text">Total Properties</p>
            <p className="text-5xl font-bold text-brand-dark-navy">{totalProperties}</p>
          </div>
          <div className="bg-brand-light-cyan p-4 rounded-full">
            <Home size={32} className="text-brand-blue" />
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-8 flex items-center justify-between">
          <div>
            <p className="text-lg font-medium text-brand-gray-text">Total Rooms Listed</p>
            <p className="text-5xl font-bold text-brand-dark-navy">{totalRooms}</p>
          </div>
          <div className="bg-brand-light-cyan p-4 rounded-full">
            <BedDouble size={32} className="text-brand-teal" />
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        {pieChartData.length > 0 ? (
          <ReactECharts
            option={pieChartOptions}
            style={{ height: '400px', width: '100%' }}
            notMerge={true}
            lazyUpdate={true}
          />
        ) : (
          <div className="text-center py-10">
            <h3 className="text-xl font-semibold text-brand-dark-navy">No Room Data Available</h3>
            <p className="text-gray-500 mt-2">Add rooms to your properties to see a distribution chart here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerDashboardPage;
