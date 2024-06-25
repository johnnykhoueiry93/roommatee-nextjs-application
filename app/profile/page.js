import Profile from '../../components/myProfile/Profile'
import '../../styles/myProfile/AccountVerification.css';
import '../../styles/userProfileWorkflow/Welcome.css';

export default async function Protected() {
  return (
    <div>
      <Profile/>
    </div>
  );
}
