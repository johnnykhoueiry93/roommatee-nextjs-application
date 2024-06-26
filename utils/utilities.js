/**
 * this function takes a paramter of data should be something like userInfo[0]
 * once userInfo[0] is passed this function will check the userType if equal to admin
 * if eqaul to admin will return true otherswise false
 */

export const isUserAdmin = (userInfo) => {
  console.log("Utils function isUserAdmin received paramter: ", userInfo);
  
  let admin = false;
  if (userInfo.userType == "admin") {
    admin = true;
  }

  console.log("Utils function return admin: " + admin);
  return admin;
};

/**
 * This function will calculate the value since when this listing was created
 * Will provide the return values in format of 
 * today if less than 24hours
 * days/weeks/months
 * 
 * @param {*} creationDate 
 * @returns 
 */
  // @ts-ignore
  export function calculateDaysSinceCreation(creationDate) {
    const currentDate = new Date();
    const createdDateUTC = new Date(creationDate);

    // Convert UTC date to Eastern Standard Time (EST)
    const createdDateEST = new Date(
      createdDateUTC.toLocaleString("en-US", { timeZone: "America/New_York" })
    );

    // Calculate the difference in milliseconds
    // @ts-ignore
    const timeDifference = currentDate - createdDateEST;

    // Convert milliseconds to days
    let daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

    // Handle cases where days difference is -1 or 0
    daysDifference = Math.max(daysDifference, 0);

    // Return different messages based on daysDifference
    // if (daysDifference === 1) {
    //   return `${daysDifference} day ago`;
    // } else {
    //   return daysDifference === 0 ? "today" : `${daysDifference} days ago`;
    // }
    if (daysDifference > 31) {
      const months = Math.floor(daysDifference / 30);
      const monthText = months === 1 ? "month" : "months";
      return `${months} ${monthText} ago`;
    } else if (daysDifference > 7) {
      const weeks = Math.floor(daysDifference / 7);
      const weekText = weeks === 1 ? "week" : "weeks";
      return `${weeks} ${weekText} ago`;
    } else {
      return `${daysDifference} days ago` || "today";
    }
  }

  /**
   * 
   * @param {*} userId 
   * @param {*} localStorageKey 
   */
   export async function getProfilePictureAndStoreInStorage(userId, localStorageKey) {
    const key = `profile-picture/${userId}-profile-picture.png`;
    
    try {
      const response = await fetch(`/api/getS3PictureUrl?key=${key}`, {
        method: 'POST',
      });
      const data = await response.json();
      
      console.log("[DEBUG] - [utilities.js] - Setting the user profile picture to URL: " + data.s3Url);
      // setUserProfilePicture(data.s3Url);
      console.log(`[DEBUG] - [utilities.js] - setting in storage ${localStorageKey}: ` + data.s3Url);
      localStorage.setItem(localStorageKey, JSON.stringify(data.s3Url));
    } catch (error) {
      console.error("Error:", error);
    }
  }

/**
 * 
 * @param {*} userId 
 * @returns 
 * 
 * How to call: 
 * const response = await getProfilePictureUrl(id);
 * id is the id of the user
 */
  export async function getProfilePictureUrl(userId) {
    const key = `profile-picture/${userId}-profile-picture.png`;
    
    try {
      const response = await fetch(`/api/getS3PictureUrl?key=${key}`, {
        method: 'POST',
      });
      const data = await response.json();
      
      // console.log("Returned Profile Picture S3 URL: " + data.s3Url);
      return data.s3Url;
    } catch (error) {
      console.error("Error:", error);
    }
  }



  export async function setMysqlDatabaseFlagTrue(emailAddress, table, column, value) {
    const requestedData = {
      emailAddress: emailAddress,
      table: table,
      column: column,
      value: value
    };

    try {
      const response = await fetch('/api/setMysqlDatabaseFlagTrue', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ requestedData }),
      });
  
      if (!response.ok) {
        throw new Error('Query failed');
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Column updat failed:', error);
      throw error;
    }
  }