export async function logFrontendActivityToBackend(message, userInfo) {
    try {
      if (!userInfo || userInfo.length === 0) {
        console.error("User info is empty");
        return;
      }
      const emailAddress= userInfo.emailAddress;
      try {
        await fetch('/api/logFrontendActivityToBackend', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ emailAddress, message }),
        });
    
      } catch (error) {
        console.error('Error send frontend message to backend logs: ', error);
        throw error;
      }
      
    } catch (error) {
      console.error('Error in logFrontendActivityToBackend:', error);
      // Handle error response
    }
}