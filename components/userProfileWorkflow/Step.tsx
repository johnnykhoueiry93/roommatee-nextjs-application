import '../../styles/userProfileWorkflow/Step.css'

//@ts-ignore
const Step = ({ currentStep, maxStep}) => {
  return (
    <div className='component-step-format'>
      <p className='step-color'><span className='current-step-format'>Step {currentStep}</span> /{maxStep}</p>
    </div>
  );
};

export default Step;
