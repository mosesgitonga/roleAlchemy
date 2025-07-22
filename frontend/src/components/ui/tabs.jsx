// import React, { createContext, useContext, useState } from "react";

// const TabsContext = createContext();

// export function Tabs({ defaultValue, children }) {
//   const [activeTab, setActiveTab] = useState(defaultValue);
//   return (
//     <TabsContext.Provider value={{ activeTab, setActiveTab }}>
//       <div className="w-full">{children}</div>
//     </TabsContext.Provider>
//   );
// }

// export function TabsList({ children }) {
//   return (
//     <div className="flex border-b border-gray-300 mb-4">{children}</div>
//   );
// }

// export function TabsTrigger({ value, children }) {
//   const { activeTab, setActiveTab } = useContext(TabsContext);
//   const isActive = activeTab === value;

//   return (
//     <button
//       onClick={() => setActiveTab(value)}
//       className={`px-4 py-2 text-sm font-medium transition-colors duration-200 ${
//         isActive
//           ? "border-b-2 border-red-500 text-red-600"
//           : "text-gray-500 hover:text-red-400"
//       }`}
//     >
//       {children}
//     </button>
//   );
// }

// export function TabsContent({ value, children }) {
//   const { activeTab } = useContext(TabsContext);
//   return activeTab === value ? <div className="">{children}</div> : null;
// }
