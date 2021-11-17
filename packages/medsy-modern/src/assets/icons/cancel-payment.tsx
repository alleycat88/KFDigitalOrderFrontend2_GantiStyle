import CancelPaymentImg from '../../../public/CancelPayment.png';

const CancelPayment = (props) => {
  return (
    <img
      src={CancelPaymentImg}
      style={{ width: props.width, margin: '0 auto' }}
    />
  );
};

export default CancelPayment;
