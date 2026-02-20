import React from "react";

const ProfileSettings = ({ role }) => {
  return (
    <div className="w-full max-w-full px-3">
      <div className="relative flex flex-col h-full min-w-0 break-words bg-white border-0 shadow-lg rounded-2xl bg-clip-border">
        <div className="p-4 pb-0 mb-0 bg-green-50 border-b-0 rounded-t-2xl">
          <h6 className="mb-0 text-lg font-semibold text-blue-800">Settings</h6>
        </div>
        <div className="flex-auto p-4">
          <h6 className="font-bold leading-tight uppercase text-xs text-slate-500">
            Account
          </h6>
          <ul className="flex flex-col pl-0 mb-0 rounded-lg">
            {role === "admin" && (
              <>
                <li className="relative block px-0 py-2 bg-white border-0 rounded-t-lg text-inherit">
                  <div className="min-h-6 mb-0.5 block pl-0">
                    <input
                      id="manage-accounts"
                      className="mt-0.54 rounded-10 duration-250 ease-soft-in-out after:rounded-circle after:shadow-soft-2xl after:duration-250 checked:after:translate-x-5.25 h-5 relative float-left ml-auto w-10 cursor-pointer appearance-none border border-solid border-gray-200 bg-slate-800/10 bg-none bg-contain bg-left bg-no-repeat align-top transition-all after:absolute after:top-px after:h-4 after:w-4 after:translate-x-px after:bg-white after:content-[''] checked:border-slate-800/95 checked:bg-slate-800/95 checked:bg-none checked:bg-right"
                      type="checkbox"
                    />
                    <label
                      htmlFor="manage-accounts"
                      className="w-4/5 mb-0 ml-4 overflow-hidden font-normal cursor-pointer select-none text-sm text-ellipsis whitespace-nowrap text-slate-500"
                    >
                      Manage user accounts
                    </label>
                  </div>
                </li>
                <li className="relative block px-0 py-2 bg-white border-0 text-inherit">
                  <div className="min-h-6 mb-0.5 block pl-0">
                    <input
                      id="configure-settings"
                      className="mt-0.54 rounded-10 duration-250 ease-soft-in-out after:rounded-circle after:shadow-soft-2xl after:duration-250 checked:after:translate-x-5.25 h-5 relative float-left ml-auto w-10 cursor-pointer appearance-none border border-solid border-gray-200 bg-slate-800/10 bg-none bg-contain bg-left bg-no-repeat align-top transition-all after:absolute after:top-px after:h-4 after:w-4 after:translate-x-px after:bg-white after:content-[''] checked:border-slate-800/95 checked:bg-slate-800/95 checked:bg-none checked:bg-right"
                      type="checkbox"
                    />
                    <label
                      htmlFor="configure-settings"
                      className="w-4/5 mb-0 ml-4 overflow-hidden font-normal cursor-pointer select-none text-sm text-ellipsis whitespace-nowrap text-slate-500"
                    >
                      Configure system settings
                    </label>
                  </div>
                </li>
                <li className="relative block px-0 py-2 bg-white border-0 text-inherit">
                  <div className="min-h-6 mb-0.5 block pl-0">
                    <input
                      id="manage-shipments"
                      className="mt-0.54 rounded-10 duration-250 ease-soft-in-out after:rounded-circle after:shadow-soft-2xl after:duration-250 checked:after:translate-x-5.25 h-5 relative float-left ml-auto w-10 cursor-pointer appearance-none border border-solid border-gray-200 bg-slate-800/10 bg-none bg-contain bg-left bg-no-repeat align-top transition-all after:absolute after:top-px after:h-4 after:w-4 after:translate-x-px after:bg-white after:content-[''] checked:border-slate-800/95 checked:bg-slate-800/95 checked:bg-none checked:bg-right"
                      type="checkbox"
                    />
                    <label
                      htmlFor="manage-shipments"
                      className="w-4/5 mb-0 ml-4 overflow-hidden font-normal cursor-pointer select-none text-sm text-ellipsis whitespace-nowrap text-slate-500"
                    >
                      Manage shipment settings
                    </label>
                  </div>
                </li>
              </>
            )}
            {role === "staff" && (
              <>
                <li className="relative block px-0 py-2 bg-white border-0 rounded-t-lg text-inherit">
                  <div className="min-h-6 mb-0.5 block pl-0">
                    <input
                      id="view-shipments"
                      className="mt-0.54 rounded-10 duration-250 ease-soft-in-out after:rounded-circle after:shadow-soft-2xl after:duration-250 checked:after:translate-x-5.25 h-5 relative float-left ml-auto w-10 cursor-pointer appearance-none border border-solid border-gray-200 bg-slate-800/10 bg-none bg-contain bg-left bg-no-repeat align-top transition-all after:absolute after:top-px after:h-4 after:w-4 after:translate-x-px after:bg-white after:content-[''] checked:border-slate-800/95 checked:bg-slate-800/95 checked:bg-none checked:bg-right"
                      type="checkbox"
                    />
                    <label
                      htmlFor="view-shipments"
                      className="w-4/5 mb-0 ml-4 overflow-hidden font-normal cursor-pointer select-none text-sm text-ellipsis whitespace-nowrap text-slate-500"
                    >
                      View shipment status
                    </label>
                  </div>
                </li>
                <li className="relative block px-0 py-2 bg-white border-0 text-inherit">
                  <div className="min-h-6 mb-0.5 block pl-0">
                    <input
                      id="update-shipment"
                      className="mt-0.54 rounded-10 duration-250 ease-soft-in-out after:rounded-circle after:shadow-soft-2xl after:duration-250 checked:after:translate-x-5.25 h-5 relative float-left ml-auto w-10 cursor-pointer appearance-none border border-solid border-gray-200 bg-slate-800/10 bg-none bg-contain bg-left bg-no-repeat align-top transition-all after:absolute after:top-px after:h-4 after:w-4 after:translate-x-px after:bg-white after:content-[''] checked:border-slate-800/95 checked:bg-slate-800/95 checked:bg-none checked:bg-right"
                      type="checkbox"
                    />
                    <label
                      htmlFor="update-shipment"
                      className="w-4/5 mb-0 ml-4 overflow-hidden font-normal cursor-pointer select-none text-sm text-ellipsis whitespace-nowrap text-slate-500"
                    >
                      Update shipment details
                    </label>
                  </div>
                </li>
              </>
            )}
            <h6 className="mt-6 font-bold leading-tight uppercase text-xs text-slate-500">
              Application
            </h6>
            <ul className="flex flex-col pl-0 mb-0 rounded-lg">
              <li className="relative block px-0 py-2 bg-white border-0 rounded-t-lg text-inherit">
                <div className="min-h-6 mb-0.5 block pl-0">
                  <input
                    id="new-launches"
                    className="mt-0.54 rounded-10 duration-250 ease-soft-in-out after:rounded-circle after:shadow-soft-2xl after:duration-250 checked:after:translate-x-5.25 h-5 relative float-left ml-auto w-10 cursor-pointer appearance-none border border-solid border-gray-200 bg-slate-800/10 bg-none bg-contain bg-left bg-no-repeat align-top transition-all after:absolute after:top-px after:h-4 after:w-4 after:translate-x-px after:bg-white after:content-[''] checked:border-slate-800/95 checked:bg-slate-800/95 checked:bg-none checked:bg-right"
                    type="checkbox"
                  />
                  <label
                    htmlFor="new-launches"
                    className="w-4/5 mb-0 ml-4 overflow-hidden font-normal cursor-pointer select-none text-sm text-ellipsis whitespace-nowrap text-slate-500"
                  >
                    New logistics features
                  </label>
                </div>
              </li>
              <li className="relative block px-0 py-2 bg-white border-0 text-inherit">
                <div className="min-h-6 mb-0.5 block pl-0">
                  <input
                    id="product-updates"
                    className="mt-0.54 rounded-10 duration-250 ease-soft-in-out after:rounded-circle after:shadow-soft-2xl after:duration-250 checked:after:translate-x-5.25 h-5 relative float-left ml-auto w-10 cursor-pointer appearance-none border border-solid border-gray-200 bg-slate-800/10 bg-none bg-contain bg-left bg-no-repeat align-top transition-all after:absolute after:top-px after:h-4 after:w-4 after:translate-x-px after:bg-white after:content-[''] checked:border-slate-800/95 checked:bg-slate-800/95 checked:bg-none checked:bg-right"
                    type="checkbox"
                  />
                  <label
                    htmlFor="product-updates"
                    className="w-4/5 mb-0 ml-4 overflow-hidden font-normal cursor-pointer select-none text-sm text-ellipsis whitespace-nowrap text-slate-500"
                  >
                    Product updates and improvements
                  </label>
                </div>
              </li>
              <li className="relative block px-0 py-2 bg-white border-0 text-inherit">
                <div className="min-h-6 mb-0.5 block pl-0">
                  <input
                    id="subscribe"
                    className="mt-0.54 rounded-10 duration-250 ease-soft-in-out after:rounded-circle after:shadow-soft-2xl after:duration-250 checked:after:translate-x-5.25 h-5 relative float-left ml-auto w-10 cursor-pointer appearance-none border border-solid border-gray-200 bg-slate-800/10 bg-none bg-contain bg-left bg-no-repeat align-top transition-all after:absolute after:top-px after:h-4 after:w-4 after:translate-x-px after:bg-white after:content-[''] checked:border-slate-800/95 checked:bg-slate-800/95 checked:bg-none checked:bg-right"
                    type="checkbox"
                  />
                  <label
                    htmlFor="subscribe"
                    className="w-4/5 mb-0 ml-4 overflow-hidden font-normal cursor-pointer select-none text-sm text-ellipsis whitespace-nowrap text-slate-500"
                  >
                    Subscribe to newsletter
                  </label>
                </div>
              </li>
            </ul>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
