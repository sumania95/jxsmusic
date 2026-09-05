import { filterState } from '@/state/globalState';
import { useAtom } from 'jotai';
import { useRouter } from 'next/router';
import React from 'react';
import { useDebouncedCallback } from 'use-debounce';

const keyData = [
  { id: 1, name: '1A', color: '#60F5D7', textColor: '#000000' },
  { id: 2, name: '1B', color: '#21ECBF', textColor: '#000000' },
  { id: 3, name: '2A', color: '#7DF5A3', textColor: '#000000' },
  { id: 4, name: '2B', color: '#3AF06D', textColor: '#000000' },
  { id: 5, name: '3A', color: '#ABF983', textColor: '#000000' },
  { id: 6, name: '3B', color: '#7AF53F', textColor: '#000000' },
  { id: 7, name: '4A', color: '#FED97E', textColor: '#000000' },
  { id: 8, name: '4B', color: '#FEC139', textColor: '#000000' },
  { id: 9, name: '5A', color: '#FDB9A0', textColor: '#000000' },
  { id: 10, name: '5B', color: '#FC8D6A', textColor: '#000000' },
  { id: 11, name: '6A', color: '#FDA6B1', textColor: '#000000' },
  { id: 12, name: '6B', color: '#FC7182', textColor: '#000000' },
  { id: 13, name: '7A', color: '#FDA0C7', textColor: '#000000' },
  { id: 14, name: '7B', color: '#FC67A5', textColor: '#000000' },
  { id: 15, name: '8A', color: '#F0A1E2', textColor: '#000000' },
  { id: 16, name: '8B', color: '#E768D1', textColor: '#000000' },
  { id: 17, name: '9A', color: '#D9A9FE', textColor: '#000000' },
  { id: 18, name: '9B', color: '#C075FF', textColor: '#000000' },
  { id: 19, name: '10A', color: '#B8C8FE', textColor: '#000000' },
  { id: 20, name: '10B', color: '#8EA5FF', textColor: '#000000' },
  { id: 21, name: '11A', color: '#8BE4F9', textColor: '#000000' },
  { id: 22, name: '11B', color: '#4BD1F8', textColor: '#000000' },
  { id: 23, name: '12A', color: '#5EF3EF', textColor: '#000000' },
  { id: 24, name: '12B', color: '#20EAE6', textColor: '#000000' },
];

const CamelotWheelComponent: React.FC = () => {
  const outerRadius = 180; // Outer radius of the outer pie
  const innerRadius = 115; // Inner radius of the inner pie (smaller than outer pie)
  const holeRadius = 50; // Central hole radius
  const center = outerRadius + 10; // Center of the SVG (for the pies)
  const [state, setState] = useAtom(filterState);
  // State to track the selected slices and their colors
//   const [selectedSlices, setSelectedSlices] = useState<Set<string>>(new Set());

  // Function to calculate the path for each sector (slice)
  const calculateSectorPath = (
    startAngle: number,
    endAngle: number,
    innerRadius: number,
    outerRadius: number
  ): string => {
    const x1 = center + innerRadius * Math.cos(startAngle);
    const y1 = center + innerRadius * Math.sin(startAngle);

    const x2 = center + outerRadius * Math.cos(startAngle);
    const y2 = center + outerRadius * Math.sin(startAngle);

    const x3 = center + outerRadius * Math.cos(endAngle);
    const y3 = center + outerRadius * Math.sin(endAngle);

    const x4 = center + innerRadius * Math.cos(endAngle);
    const y4 = center + innerRadius * Math.sin(endAngle);

    return `M ${x1} ${y1} L ${x2} ${y2} A ${outerRadius} ${outerRadius} 0 0 1 ${x3} ${y3} L ${x4} ${y4} A ${innerRadius} ${innerRadius} 0 0 0 ${x1} ${y1} Z`;
  };

  // Function to calculate the text position (center of each slice)
  const calculateLabelPosition = (angle: number, radius: number) => {
    const x = center + radius * Math.cos(angle);
    const y = center + radius * Math.sin(angle);
    return { x, y };
  };

  // Handle slice click event
//   const handleSliceClick = (sliceId: string) => {
//     const newSelectedSlices = new Set(selectedSlices);
//     if (newSelectedSlices.has(sliceId)) {
//       newSelectedSlices.delete(sliceId); // Deselect the slice if already selected
//     } else {
//       newSelectedSlices.add(sliceId); // Select the slice
//     }
//     setSelectedSlices(newSelectedSlices); // Update the state
//     console.log(`${sliceId} clicked`); // Log which slice was clicked
//   };
const router = useRouter()
const handleSliceClick = async(sliceName: string) => {
    
    const updatedSelectedSlices = [...state.keyTemp];
    const sliceIndex = updatedSelectedSlices.indexOf(sliceName);

    if (sliceIndex !== -1) {
      updatedSelectedSlices.splice(sliceIndex, 1); // Deselect the slice
    } else {
      updatedSelectedSlices.push(sliceName); // Select the slice
    }
    setState({
        ...state,
        keyTemp:updatedSelectedSlices
    }); // Update the local state
    await router.push('?page=1')
  };

  // Debounced function to update global state after delay
  const debouncedUpdateState = useDebouncedCallback(() => {
    setState({
      ...state,
      key: state.keyTemp, // Update the global state (or database) with the selected slices
    });
  }, 1000);

  React.useEffect(() => {
    debouncedUpdateState(); // Trigger debounced update when selectedSlices change
  }, [state.keyTemp, debouncedUpdateState]);

  // Check if any slice is selected
//   const isAnySliceActive = selectedSlices.size > 0;

return (
    <div className="flex justify-center items-center -m-3 select-none">
      <svg
        width={center * 2}
        height={center * 2}
        viewBox={`0 0 ${center * 2} ${center * 2}`}
        className="rounded-lg shadow"
      >
        {/* Central Hole */}
        <circle
          cx={center}
          cy={center}
          r={holeRadius}
          fill="white"
          stroke="black"
          strokeWidth="2"
        />

        {/* Outer Pie (12 Slices) */}
        {Array.from({ length: 12 }).map((_, index) => {
          const startAngle = (index / 12) * 2 * Math.PI;
          const endAngle = ((index + 1) / 12) * 2 * Math.PI;

          const sliceName = `${index + 1}B`;
          const sliceColor = keyData.find(k => k.name === sliceName)?.color ?? '#FFFFFF';

          // If no slice is selected, use the true color for all slices
          const fillColor =
            state.keyTemp.length === 0 || state.keyTemp.includes(sliceName)
              ? sliceColor
              : '#D1D5DB'; // Gray for unselected slices

          const outerSectorPath = calculateSectorPath(startAngle, endAngle, holeRadius, outerRadius);
          const midAngle = (startAngle + endAngle) / 2;
          const labelPosition = calculateLabelPosition(midAngle, outerRadius - 35);

          return (
            <g
              key={index}
              onClick={() => handleSliceClick(sliceName)} // Use local state update
              className="cursor-pointer" // Add cursor pointer for hover effect
            >
              <path
                d={outerSectorPath}
                fill={fillColor}
                stroke="black"
                strokeWidth="1"
              />
              <text
                x={labelPosition.x}
                y={labelPosition.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="16"
                fill={keyData.find(k => k.name === sliceName)?.textColor ?? 'black'}
              >
                {sliceName}
              </text>
            </g>
          );
        })}

        {/* Inner Pie (12 Slices) */}
        {Array.from({ length: 12 }).map((_, index) => {
          const startAngle = (index / 12) * 2 * Math.PI;
          const endAngle = ((index + 1) / 12) * 2 * Math.PI;

          const sliceName = `${index + 1}A`;
          const sliceColor = keyData.find(k => k.name === sliceName)?.color ?? '#FFFFFF';

          const fillColor =
            state.keyTemp.length === 0 || state.keyTemp.includes(sliceName)
              ? sliceColor
              : '#D1D5DB'; // Gray for unselected slices

          const innerSectorPath = calculateSectorPath(startAngle, endAngle, holeRadius, innerRadius);
          const midAngle = (startAngle + endAngle) / 2;
          const labelPosition = calculateLabelPosition(midAngle, innerRadius - 35);

          return (
            <g
              key={index}
              onClick={() => handleSliceClick(sliceName)} // Use local state update
              className="cursor-pointer" // Add cursor pointer for hover effect
            >
              <path
                d={innerSectorPath}
                fill={fillColor}
                stroke="black"
                strokeWidth="1"
              />
              <text
                x={labelPosition.x}
                y={labelPosition.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="16"
                fill={keyData.find(k => k.name === sliceName)?.textColor ?? 'black'}
              >
                {sliceName}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default CamelotWheelComponent;
