// src/components/RefreshLoader.jsx
const RefreshLoader = () => {
    return (
      <div className="fixed top-0 left-0 right-0 h-1 z-50 overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 animate-refresh-load"
          style={{
            animation: 'refresh-load 1s ease-out forwards'
          }}
        />
      </div>
    );
  };
  
  export default RefreshLoader;