"use client";

import { useEffect, useState } from "react";

interface Vehicle {
  id: number;
  x: number;
  y: number;
  rotation: number;
  speed: number;
  path: { x: number; y: number }[];
  currentPathIndex: number;
}

export const MovingCars = () => {
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);

    useEffect(() => {
      // Initialize vehicles with random paths
      const initialVehicles: Vehicle[] = Array.from({ length: 5 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        rotation: Math.random() * 360,
        speed: 0.3 + Math.random() * 0.5,
        path: generateRandomPath(),
        currentPathIndex: 0,
      }));
  
      setVehicles(initialVehicles);
  
      const interval = setInterval(() => {
        setVehicles((prevVehicles) =>
          prevVehicles.map((vehicle) => {
            const targetPoint = vehicle.path[vehicle.currentPathIndex];
            const dx = targetPoint.x - vehicle.x;
            const dy = targetPoint.y - vehicle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
  
            if (distance < 2) {
              // Move to next point in path
              return {
                ...vehicle,
                currentPathIndex:
                  (vehicle.currentPathIndex + 1) % vehicle.path.length,
              };
            }
  
            // Calculate new position
            const angle = Math.atan2(dy, dx);
            const newX = vehicle.x + Math.cos(angle) * vehicle.speed;
            const newY = vehicle.y + Math.sin(angle) * vehicle.speed;
            const rotation = (angle * 180) / Math.PI + 90;
  
            return {
              ...vehicle,
              x: newX,
              y: newY,
              rotation,
            };
          })
        );
      }, 50);
  
      return () => clearInterval(interval);
    }, []);
  
    return (
      <svg
        className="absolute inset-0 w-full h-full opacity-30"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {/* Background grid */}
        <defs>
          <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path
              d="M 10 0 L 0 0 0 10"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.1"
              className="text-secondary/20"
            />
          </pattern>
        </defs>
        <rect width="100" height="100" fill="url(#grid)" />
  
        {/* Animated vehicles */}
        {vehicles.map((vehicle) => (
          <g
            key={vehicle.id}
            transform={`translate(${vehicle.x}, ${vehicle.y}) rotate(${vehicle.rotation})`}
          >
            {/* Vehicle body */}
            <rect
              x="-0.8"
              y="-1.5"
              width="1.6"
              height="3"
              rx="0.3"
              fill="currentColor"
              className="text-secondary"
            />
            {/* Vehicle windows */}
            <rect
              x="-0.5"
              y="-0.8"
              width="1"
              height="0.8"
              rx="0.1"
              fill="currentColor"
              className="text-background"
            />
            {/* Trail effect */}
            <circle
              cx="0"
              cy="2"
              r="0.5"
              fill="currentColor"
              className="text-secondary/30"
            />
          </g>
        ))}
  
        {/* Route lines connecting vehicles */}
        {vehicles.map((vehicle, index) => {
          const nextVehicle = vehicles[(index + 1) % vehicles.length];
          return (
            <line
              key={`line-${vehicle.id}`}
              x1={vehicle.x}
              y1={vehicle.y}
              x2={nextVehicle.x}
              y2={nextVehicle.y}
              stroke="currentColor"
              strokeWidth="0.1"
              className="text-secondary/20"
              strokeDasharray="1,1"
            />
          );
        })}
      </svg>
    );
}

function generateRandomPath(): { x: number; y: number }[] {
    const points: { x: number; y: number }[] = [];
    const numPoints = 4 + Math.floor(Math.random() * 4);
  
    for (let i = 0; i < numPoints; i++) {
      points.push({
        x: 10 + Math.random() * 80,
        y: 10 + Math.random() * 80,
      });
    }
  
    return points;
  }
  