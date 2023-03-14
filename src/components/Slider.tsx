import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {
  SliderOptions,
  ThumbOptions,
  TickMarkOptions,
  TrackOptions,
} from '../types';
import SliderContextProvider from '../context/SliderContext';

export interface GaugeProps extends SliderOptions {
  trackOptions: TrackOptions;
  tickMarkOptions: TickMarkOptions;
  thumbOptions: Required<ThumbOptions>;
  children?: React.ReactNode;
  InnerComponent?: React.ReactNode;
}

export default function Slider({
  size,
  clockwise,
  trackOptions,
  tickMarkOptions,
  thumbOptions,
  children,
  InnerComponent,
  startLimit,
  enabled
}: GaugeProps) {
  const {width = size * 0.1, color = '#7F8487'} = trackOptions;
  const {
    show = false,
    unit = 5,
    total = 100,
    color: tickMarkColor = '#7F8487',
    length = 10,
    thickness = 2,
    showText = show,
    textSize = 10,
    textColor = '#191919',
  } = tickMarkOptions;
  return (
    <SliderContextProvider
      sliderOptions={{size, clockwise: clockwise ?? true}}
      trackOptions={{width, color}}
      tickMarkOptions={{
        show,
        unit,
        total,
        color: tickMarkColor,
        length,
        thickness,
        showText,
        textSize,
        textColor,
      }}
      InnerComponent={InnerComponent}
      thumbOptions={thumbOptions}
      startLimit={startLimit}
      enabled={  enabled      }
      >
      <View style={[styles.container, {width: size, height: size}]}>
        {children}
      </View>
    </SliderContextProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
});
