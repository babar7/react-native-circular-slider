import React from 'react';
import {canvas2Polar, Vector} from 'react-native-redash';
import {runOnJS, useSharedValue, withTiming} from 'react-native-reanimated';

import {
  useSliderContext,
  useTickMarkContext,
} from '../../context/SliderContext';
import {Container} from '../../components/Container';
import {FilledGauge, Thumb} from '../../components/svg';
import {GestureContext} from '../../components/Gesture';
import {amount2Theta, normalize, theta2Amount} from '../../utils/worklets';

export interface AmountProps {
  amount: number;
  thumbColor: string;
  filledColor: string;
  onChange?: (amount: number) => void;
  onChangeActive?: (amount: number) => void;
  startLimit?: number;
}

// UPDATE: set start limit here
// Update: Need to add startlimit into Context
export function Amount({
  amount,
  thumbColor,
  filledColor,
  onChange,
  onChangeActive
}: AmountProps) {
  const {center, clockwise, startLimit, enabled} = useSliderContext();
  const {total, showThumb} = useTickMarkContext();
  const _amount: number = startLimit + amount;

  const zeroTheta = useSharedValue(amount2Theta(startLimit, total, clockwise));
  const theta = useSharedValue(amount2Theta(_amount, total, clockwise));


  // Updating startLimit on change
  React.useEffect(()=>{
    const startTheta = amount2Theta(startLimit, total, clockwise);
    const endTheta = amount2Theta(_amount, total, clockwise);

    zeroTheta.value = withTiming(startTheta, {duration : 500});
    theta.value = withTiming(endTheta, {duration : 500});

  },[startLimit]);

  // Updating endLimit on change
  React.useEffect(()=>{
    const endTheta = amount2Theta(amount, total, clockwise);
    theta.value = withTiming(endTheta, {duration : 500});

  },[amount]);

  // Validate change according to the startLimit;
  // Handle All custom functionality here;
  function validateLimit(delta: number) {
    'worklet';

    const updTheta = normalize(theta.value + delta);
    const updValue = theta2Amount(updTheta, total, clockwise);
    const isValid = updValue >= Math.round(updValue) && updValue > startLimit;
    return {
      updValue: Math.round(updValue),
      updTheta,
      isValid,
    };
  }

  const onGestureActive = ({x, y}: Vector, context: GestureContext) => {
    'worklet';
    if (!enabled) return;
    if (context.target.value?.curr) {
      const {theta: newTheta} = canvas2Polar({x, y}, center.value);
      const delta = newTheta - context.offset;
      const {isValid, updTheta, updValue} = validateLimit(delta);
      if (isValid) {
        theta.value = updTheta;
        context.offset = newTheta;
        if (onChangeActive) {
          runOnJS(onChangeActive)(updValue);
        }
      }
    }
  };

  const onGestureEnd = ({x, y}: Vector, context: GestureContext) => {
    'worklet';
    context.target.value = null;

    if (onChange) {
      runOnJS(onChange)(theta2Amount(theta.value, total, clockwise));
    }
  };

  return (
    <Container
      thetas={[theta]}
      onGestureActive={onGestureActive}
      onGestureEnd={onGestureEnd}>
      <FilledGauge
        color={filledColor}
        startTheta={zeroTheta}
        endTheta={theta}
      />
      {showThumb && <Thumb theta={theta} color={thumbColor} />}
    </Container>
  );
}
