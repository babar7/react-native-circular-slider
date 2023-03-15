import React from 'react';
import {useSharedValue} from 'react-native-reanimated';
import {canvas2Polar, Vector} from 'react-native-redash';

import CursorOverlay from './CursorOverlay';
import {GestureThumbs, SharedNumber} from '../types';
import {Canvas, TickMark, Track} from '../components/svg';
import Gesture, {GestureContext} from '../components/Gesture';
import {
  useSliderContext,
  useThumbContext,
  useTickMarkContext,
} from '../context/SliderContext';

export interface ContainerProps {
  thetas: SharedNumber[];
  onGestureActive?: (vector: Vector, context: GestureContext) => void;
  onGestureEnd?: (vector: Vector, context: GestureContext) => void;
  children?: React.ReactNode;
}

export function Container({
  thetas,
  onGestureActive,
  onGestureEnd,
  children,
}: ContainerProps) {
  const {size, r, center, InnerComponent} = useSliderContext();
  const {show} = useTickMarkContext();
  const {icons} = useThumbContext();

  const target = useSharedValue<GestureThumbs | null>(null);

  const onGestureStart = ({x, y}: Vector, context: GestureContext) => {
    'worklet';
    const {theta} = canvas2Polar({x, y}, center.value);
    context.offset = theta;
    context.target = target;
  };

  // UPDATE: InnerComponent Updates From Here
  return (
    <>
      <Canvas size={size}>
        <Track />
        {show && (
          //  @ts-ignore
          <InnerComponent />
        )}
        {children}
      </Canvas>
      <Gesture
        onStart={onGestureStart}
        onActive={onGestureActive}
        onEnd={onGestureEnd}>
        {thetas.reduce((acc, curr, index, arr) => {
          const prev = arr[index - 1] || arr[arr.length - 1];
          const next = arr[index + 1] || arr[0];

          acc.push(
            <CursorOverlay
              key={index}
              theta={curr}
              onPressIn={() =>
                (target.value = {
                  prev,
                  curr,
                  next,
                })
              }>
              {icons[index]}
            </CursorOverlay>,
          );
          return acc;
        }, [] as React.ReactNode[])}
      </Gesture>
    </>
  );
}
