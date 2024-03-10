import { Link } from "raviger";
import { useEffect } from "react";

import * as Notification from "../../Utils/Notification.js";

export default function Error404() {
  useEffect(() => {
    Notification.closeAllNotifications();
  }, []);

  return (
    <div className="flex h-screen items-center justify-center text-center">
      <div className="w-[500px] text-center">
        <img
          alt="Error 404"
          className="w-full"
          src="https://i0.wp.com/learn.onemonth.com/wp-content/uploads/2017/08/1-10.png?fit=845%2C503&ssl=1"
        />
        <h1>Page Not Found</h1>
        <p>
          It appears that you have stumbled upon a page that either does not
          exist or has been moved to another URL. Make sure you have entered the
          correct link!
          <br />
          <br />
          <Link
            className="inline-block rounded-lg bg-zinc-800 px-4 py-2 text-white hover:bg-gray-700 hover:text-white"
            href="/"
          >
            Return to Homepage
          </Link>
        </p>
      </div>
    </div>
  );
}
