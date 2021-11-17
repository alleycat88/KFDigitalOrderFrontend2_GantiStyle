import BadgeShopeePayImg from '../../../public/logo_qris_payment-shopeepay.png';
import BadgeDanaImg from '../../../public/logo_qris_payment-dana.png';
import BadgeGopayImg from '../../../public/logo_qris_payment-gopay.png';
import BadgeLinkAjaImg from '../../../public/logo_qris_payment-linkaja.png';
import BadgeOvoImg from '../../../public/logo_qris_payment-ovo.png';
import BadgeMobileBankingImg from '../../../public/logo_qris_payment-mobilebanking.png';
import BadgeSecurePaymentImg from '../../../public/logo_qris_payment-secure-payment.png';

export const BadgeShopeePay = ({ ...props }) => {
  return <img src={BadgeShopeePayImg} />;
};

export const BadgeDana = ({ ...props }) => {
  return <img src={BadgeDanaImg} />;
};

export const BadgeGopay = ({ ...props }) => {
  return <img src={BadgeGopayImg} />;
};

export const BadgeLinkAja = ({ ...props }) => {
  return <img src={BadgeLinkAjaImg} />;
};

export const BadgeOvo = ({ ...props }) => {
  return <img src={BadgeOvoImg} />;
};

export const BadgeMobileBanking = ({ ...props }) => {
  return <img style={props.style} src={BadgeMobileBankingImg} />;
};

export const BadgeSecurePayment = ({ ...props }) => {
  return <img style={props.style} src={BadgeSecurePaymentImg} />;
};
