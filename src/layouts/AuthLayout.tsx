import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const AuthLayout: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div 
      className="min-h-screen bg-cover bg-center font-inter" 
      style={{ backgroundImage: `url('https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://s3-alpha-sig.figma.com/img/abe8/3aa0/e9fd3641f62343728583b95301e40de8?Expires=1762732800&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=XAm4CG0whdvGj2b-Nr5Y~mqjaz6qqglV7~4ar0vBvJ953UNrM8nHKsfitIr-o9GxUM6y2SCOQlDfOgZWjwZMVSI2Q40XPlKyYl4SXcOSvuOvXzefZTkin2n8zlDVJOeKR23cQQatVDySv7vsKR5XrhqdcMbSPLdlShBBKLEwRIDgvubetCd6SZ5oJ2Ptl9Mdjacs6cpJn4cgLwXOzDw7BBSgaoelFETnmoHbWUwm2lmTMinTuiqPn5-2N2XvZWfxF2kvQmadR5uhNmitwHWJluRR7bJohP~o6Krc0S3TKXHd~IBMLXtq1jte~faOJsMEM9Eb-58ftPzgrj7LpUAHiQ__')` }}
    >
      <div className="min-h-screen w-full bg-gradient-to-r from-brand-cyan-gradient-start to-brand-cyan-gradient-start/30 flex flex-col justify-center p-8 md:p-16 relative">
        <button
          onClick={() => navigate('/')}
          className="absolute top-8 left-8 text-black hover:text-gray-700 transition-colors"
          aria-label="Go back to homepage"
        >
          <ArrowLeft size={32} />
        </button>

        <div className="w-full max-w-lg">
          <div className="flex items-center space-x-4 mb-12">
            <img
              src="https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://s3-alpha-sig.figma.com/img/f6dd/665b/34697342d2b14a54054bcdeaff51c60e?Expires=1762732800&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=CnCweB1ZAYzDFij45dFKizYvfbLnk5zuP~UE5S2O6y70y0UPCr2Vbw6mTziHytjTaDwT7pVo~yuN9nmy4UE4svQoPMKrt-RzSyjHA-VxYzTTpfpskBfYhJOFr4D2A2fIoHXHdU9gOLNp3OnAMYk4IDlvrVci03hmDYKrBg2g-jeoaeWfRa8IuaMFNyctnHvRte~1K4Bk1Pkz1~gvR-S9clcPr8~Q3n3FHZQC0xHkW0vrLJoWc6NLHhrrYL208ZE9LbAwyj3R0RqJ~MEH9kmW-29BRe7t0IRNPV93qLWb~FwgEVehI6w5zjKv82U~3Y-wDbpwSqPgxZwsINyksG02iw__"
              alt="Homebase Finder Logo"
              className="h-20 w-20"
            />
            <div>
              <div className="text-2xl font-black text-brand-dark-navy">HOMEBASE</div>
              <div className="text-2xl font-black text-brand-teal">FINDER</div>
            </div>
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
