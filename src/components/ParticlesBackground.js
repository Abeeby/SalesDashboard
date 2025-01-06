import React from 'react';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';

export function ParticlesBackground({ theme }) {
  const particlesInit = async (main) => {
    await loadFull(main);
  };

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={{
        background: {
          color: {
            value: theme === 'dark' ? '#1a1a1a' : '#ffffff',
          },
        },
        particles: {
          number: {
            value: 50,
            density: {
              enable: true,
              value_area: 800,
            },
          },
          color: {
            value: theme === 'dark' ? '#ffffff' : '#000000',
          },
          shape: {
            type: "circle",
          },
          opacity: {
            value: 0.2,
            random: true,
          },
          size: {
            value: 3,
            random: true,
          },
          move: {
            enable: true,
            speed: 1,
            direction: "none",
            random: true,
            straight: false,
            outModes: {
              default: "bounce",
            },
          },
          links: {
            enable: true,
            distance: 150,
            color: theme === 'dark' ? '#ffffff' : '#000000',
            opacity: 0.1,
            width: 1,
          },
        },
      }}
    />
  );
} 