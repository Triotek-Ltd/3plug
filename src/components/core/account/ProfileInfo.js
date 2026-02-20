import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faPhone,
  faEnvelope,
  faMapMarkerAlt,
  faUserTag,
  faBriefcase,
  faCalendarDay,
  faSignInAlt,
  faImage,
  faBirthdayCake,
  faGlobe,
  faCodeBranch,
} from "@fortawesome/free-solid-svg-icons";

const ProfileInfo = ({ userData }) => {
  return (
    <div className="w-full max-w-full px-4 lg:max:mt-6">
      <div className="relative flex flex-col h-full min-w-0 break-words bg-white border-0 shadow-lg rounded-2xl bg-clip-border">
        <div className="p-4 pb-0 mb-0 bg-pink-50 border-b-0 rounded-t-2xl">
          <h6 className="mb-0 text-lg font-semibold text-purple-800">
            Profile Information
          </h6>
        </div>
        <div className="flex-auto p-4">
          <p className="leading-normal text-sm mb-1 text-gray-700">
            {userData?.bio || "No bio available"}
          </p>
          <hr className="my-1 border-t border-gray-200" />
          <ul className="flex flex-col space-y-2">
            <li className="flex items-center px-4 py-3 bg-pink-100 border border-pink-300 rounded-lg text-sm">
              <FontAwesomeIcon icon={faUser} className="text-pink-600 mr-3" />
              <strong className="text-slate-700 w-32">Full Name:</strong> &nbsp;
              <span>
                {userData?.first_name || "Anonymous"}{" "}
                {userData?.last_name || ""}
              </span>
            </li>
            <li className="flex items-center px-4 py-3 bg-purple-100 border border-purple-300 rounded-lg text-sm">
              <FontAwesomeIcon
                icon={faPhone}
                className="text-purple-600 mr-3"
              />
              <strong className="text-slate-700 w-32">Mobile:</strong> &nbsp;
              <span>{userData?.phone || "N/A"}</span>
            </li>
            <li className="flex items-center px-4 py-3 bg-green-100 border border-green-300 rounded-lg text-sm">
              <FontAwesomeIcon
                icon={faEnvelope}
                className="text-green-600 mr-3"
              />
              <strong className="text-slate-700 w-32">Email:</strong> &nbsp;
              <span>{userData?.email || "N/A"}</span>
            </li>
            <li className="flex items-center px-4 py-3 bg-pink-100 border border-pink-300 rounded-lg text-sm">
              <FontAwesomeIcon
                icon={faMapMarkerAlt}
                className="text-pink-600 mr-3"
              />
              <strong className="text-slate-700 w-32">Location:</strong> &nbsp;
              <span>{userData?.location || "N/A"}</span>
            </li>
            <li className="flex items-center px-4 py-3 bg-purple-100 border border-purple-300 rounded-lg text-sm">
              <FontAwesomeIcon
                icon={faUserTag}
                className="text-purple-600 mr-3"
              />
              <strong className="text-slate-700 w-32">Username:</strong> &nbsp;
              <span>{userData?.username || "N/A"}</span>
            </li>
            <li className="flex items-center px-4 py-3 bg-green-100 border border-green-300 rounded-lg text-sm">
              <FontAwesomeIcon
                icon={faBriefcase}
                className="text-green-600 mr-3"
              />
              <strong className="text-slate-700 w-32">Role:</strong> &nbsp;
              <span>{userData?.role || "N/A"}</span>
            </li>
            <li className="flex items-center px-4 py-3 bg-pink-100 border border-pink-300 rounded-lg text-sm">
              <FontAwesomeIcon
                icon={faCalendarDay}
                className="text-pink-600 mr-3"
              />
              <strong className="text-slate-700 w-32">Date Joined:</strong>{" "}
              &nbsp;
              <span>
                {userData?.date_joined
                  ? new Date(userData.date_joined).toLocaleDateString()
                  : "N/A"}
              </span>
            </li>
            <li className="flex items-center px-4 py-3 bg-purple-100 border border-purple-300 rounded-lg text-sm">
              <FontAwesomeIcon
                icon={faSignInAlt}
                className="text-purple-600 mr-3"
              />
              <strong className="text-slate-700 w-32">Last Login:</strong>{" "}
              &nbsp;
              <span>
                {userData?.last_login
                  ? new Date(userData.last_login).toLocaleDateString()
                  : "N/A"}
              </span>
            </li>
            <li className="flex items-center px-4 py-3 bg-green-100 border border-green-300 rounded-lg text-sm">
              <FontAwesomeIcon icon={faImage} className="text-green-600 mr-3" />
              <strong className="text-slate-700 w-32">
                Profile Picture:
              </strong>{" "}
              &nbsp;
              <span>{userData?.profile_picture || "N/A"}</span>
            </li>
            <li className="flex items-center px-4 py-3 bg-pink-100 border border-pink-300 rounded-lg text-sm">
              <FontAwesomeIcon
                icon={faBirthdayCake}
                className="text-pink-600 mr-3"
              />
              <strong className="text-slate-700 w-32">Birthdate:</strong> &nbsp;
              <span>
                {userData?.birthdate
                  ? new Date(userData.birthdate).toLocaleDateString()
                  : "N/A"}
              </span>
            </li>
            <li className="flex items-center px-4 py-3 bg-purple-100 border border-purple-300 rounded-lg text-sm">
              <FontAwesomeIcon
                icon={faGlobe}
                className="text-purple-600 mr-3"
              />
              <strong className="text-slate-700 w-32">Timezone:</strong> &nbsp;
              <span>{userData?.timezone || "N/A"}</span>
            </li>
            <li className="flex items-center px-4 py-3 bg-green-100 border border-green-300 rounded-lg text-sm">
              <FontAwesomeIcon
                icon={faCodeBranch}
                className="text-green-600 mr-3"
              />
              <strong className="text-slate-700 w-32">Branch:</strong> &nbsp;
              <span>{userData?.branch || "N/A"}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;
