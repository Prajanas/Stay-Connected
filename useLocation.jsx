import * as Location from "expo-location";
import { useEffect, useState } from "react";

function useLocation() {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const getLocation = async () => {
      try {
        const { granted } = await Location.requestForegroundPermissionsAsync();
        if (!granted) {
          alert("Permission to access location was denied");
          return;
        }

        const locationListener = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.BestForNavigation,
            timeInterval: 5000,
          },
          (newLocation) => {
            if (isMounted) {
              setUserData(newLocation.coords);
            }
          }
        );

        return () => {
          isMounted = false;
          if (locationListener) {
            locationListener.remove();
          }
        };
      } catch (error) {
        alert("Error getting location");
      }
    };

    getLocation();
  }, []);

  return { userData };
}

export default useLocation;
