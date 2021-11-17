import React from 'react';
import {
  FeatureBase,
  FeatureCounter,
  FeatureContent,
  FeatureTitle,
  FeatureDetails,
} from './utils/theme';

type FeatureBLockProps = {
  title: string;
  description: string;
  className?: string;
  counterBg?: string;
  counter: number;
};

const FeatureBLock: React.FC<FeatureBLockProps> = ({
  title,
  description,
  className,
  counterBg,
  counter,
}) => {
  const classNames = FeatureBase + ' ' + className;
  return (
    <div className={classNames}>
      <div className={FeatureContent}>
        <span style={{padding: '10px', borderRadius: '18px', width: '50px', marginBottom: '20px', backgroundColor: '#edd8b9'}}>
          <span className={FeatureCounter} style={{ color: '#F4A123', width: '30px', height: '30px', fontSize: '1em', fontWeight: 700, backgroundColor: "transparent" }}>
            {counter}
          </span>
        </span>
        <h3 className={FeatureTitle} style={{fontSize: '.9em'}}>{title}</h3>

        <p className={FeatureDetails} style={{fontSize: '.8em'}}>{description}</p>
      </div>
    </div>
  );
};

export default FeatureBLock;
