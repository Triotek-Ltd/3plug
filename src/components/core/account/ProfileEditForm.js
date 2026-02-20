import React, {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";

const ProfileEditForm = forwardRef(
  ({ user, onSubmit, formData, setFormData }, ref) => {
    useEffect(() => {
      if (user) {
        setFormData({
          first_name: user.first_name || "",
          last_name: user.last_name || "",
          email: user.email || "",
          bio: user.bio || "",
          phone: user.phone || "",
          location: user.location || "",
          birthdate: user.birthdate,
          timezone: user.timezone || "",
        });
      }
    }, [user]);

    const formRef = useRef(null);

    const handleInputChange = (name, value) => {
      setFormData({
        ...formData,
        [name]: value,
      });
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      if (onSubmit) {
        await onSubmit(formData);
      }
    };

    useImperativeHandle(ref, () => ({
      submit: () => {
        if (formRef.current) {
          formRef.current.requestSubmit();
        }
      },
    }));

    return (
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="p-2 space-y-6 md:col-span-3"
      >
        <div className="bg-white border border-4 my-8 p-8 rounded-lg shadow relative">
          <div className="grid grid-cols-6 gap-6">
            <div className="col-span-6 sm:col-span-3">
              <label
                htmlFor="first_name"
                className="text-sm font-medium text-gray-900 block mb-2"
              >
                First Name
              </label>
              <input
                type="text"
                id="first_name"
                name="first_name"
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-purple-600 focus:border-purple-600 block w-full p-2.5"
                placeholder="First Name"
                required
                onChange={(e) =>
                  handleInputChange("first_name", e.target.value)
                }
                value={formData.first_name}
              />
            </div>
            <div className="col-span-6 sm:col-span-3">
              <label
                htmlFor="last_name"
                className="text-sm font-medium text-gray-900 block mb-2"
              >
                Last Name
              </label>
              <input
                type="text"
                id="last_name"
                name="last_name"
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-purple-600 focus:border-purple-600 block w-full p-2.5"
                placeholder="Last Name"
                required
                onChange={(e) => handleInputChange("last_name", e.target.value)}
                value={formData.last_name}
              />
            </div>
            <div className="col-span-6 sm:col-span-3">
              <label
                htmlFor="email"
                className="text-sm font-medium text-gray-900 block mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-purple-600 focus:border-purple-600 block w-full p-2.5"
                placeholder="Email"
                required
                onChange={(e) => handleInputChange("email", e.target.value)}
                value={formData.email}
              />
            </div>
            <div className="col-span-6 sm:col-span-3">
              <label
                htmlFor="phone"
                className="text-sm font-medium text-gray-900 block mb-2"
              >
                Phone
              </label>
              <input
                type="text"
                id="phone"
                name="phone"
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-purple-600 focus:border-purple-600 block w-full p-2.5"
                placeholder="Phone"
                onChange={(e) => handleInputChange("phone", e.target.value)}
                value={formData.phone}
              />
            </div>
            <div className="col-span-6 sm:col-span-3">
              <label
                htmlFor="location"
                className="text-sm font-medium text-gray-900 block mb-2"
              >
                Location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-purple-600 focus:border-purple-600 block w-full p-2.5"
                placeholder="Location"
                onChange={(e) => handleInputChange("location", e.target.value)}
                value={formData.location}
              />
            </div>
            <div className="col-span-6 sm:col-span-3">
              <label
                htmlFor="birthdate"
                className="text-sm font-medium text-gray-900 block mb-2"
              >
                Birthdate
              </label>
              <input
                type="date"
                id="birthdate"
                name="birthdate"
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-purple-600 focus:border-purple-600 block w-full p-2.5"
                onChange={(e) => handleInputChange("birthdate", e.target.value)}
                value={formData.birthdate}
              />
            </div>
            <div className="col-span-6 sm:col-span-3">
              <label
                htmlFor="password"
                className="text-sm font-medium text-gray-900 block mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-purple-600 focus:border-purple-600 block w-full p-2.5"
                placeholder="Password"
                onChange={(e) => handleInputChange("password", e.target.value)}
                value={formData.password}
              />
            </div>
            <div className="col-span-6 sm:col-span-3">
              <label
                htmlFor="timezone"
                className="text-sm font-medium text-gray-900 block mb-2"
              >
                Timezone
              </label>
              <input
                type="text"
                id="timezone"
                name="timezone"
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-purple-600 focus:border-purple-600 block w-full p-2.5"
                placeholder="Timezone"
                onChange={(e) => handleInputChange("timezone", e.target.value)}
                value={formData.timezone}
              />
            </div>

            <div className="col-span-6">
              <label
                htmlFor="bio"
                className="text-sm font-medium text-gray-900 block mb-2"
              >
                Bio
              </label>
              <textarea
                id="bio"
                name="bio"
                rows="6"
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-purple-600 focus:border-purple-600 block w-full p-4"
                placeholder="Bio"
                required
                onChange={(e) => handleInputChange("bio", e.target.value)}
                value={formData.bio}
              ></textarea>
            </div>
          </div>
        </div>
      </form>
    );
  }
);

export default ProfileEditForm;
