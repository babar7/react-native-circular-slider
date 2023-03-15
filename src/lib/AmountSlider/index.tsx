import React from 'react';

import {Amount} from './Amount';
import Slider from '../../components/Slider';
import {SliderOptions, TickMarkOptions, TrackOptions} from '../../types';
import { View } from 'react-native';

export interface AmountSliderProps extends SliderOptions {
  amount: number;
  startLimit?: number;
  thumbColor?: string;
  filledColor?: string;
  onChange?: (amount: number) => void;
  onChangeActive?: (amount: number) => void;
  thumbIcon?: React.ReactNode;
  trackOptions?: TrackOptions;
  tickMarkOptions?: TickMarkOptions;
  InnerComponent?: any;
  enabled ? : boolean
}

// UPDATE: update props here
export function AmountSlider({
  size,
  clockwise,
  thumbColor = '#FFA500',
  filledColor = '#FFE5B4',
  amount,
  onChange,
  onChangeActive,
  thumbIcon,
  trackOptions = {},
  tickMarkOptions = {},
  InnerComponent = View,
  startLimit = 0,
  enabled = true 
}: AmountSliderProps) {


  return (
    <Slider
      size={size}
      clockwise={clockwise}
      trackOptions={trackOptions}
      tickMarkOptions={tickMarkOptions}
      thumbOptions={{colors: ['#FFA500'], icons: [thumbIcon]}}
      InnerComponent={InnerComponent}
      startLimit={startLimit}
      enabled={enabled}
      >
      <Amount
        amount={amount}
        thumbColor={thumbColor}
        filledColor={filledColor}
        onChange={onChange}
        onChangeActive={onChangeActive}
      />
    </Slider>
  );
}
