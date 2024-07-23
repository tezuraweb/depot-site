import React, { useState, useEffect, useRef, Suspense } from 'react';
import LoadingSpinner from '../includes/LoadingSpinner';
import Territory from '../includes/maps/Territory';
import FloorMap from '../includes/maps/FloorMap';

const Scheme = ({ activeElement = null }) => {
    const [floors, setFloors] = useState([]);
    const svgRef = useRef(null);

    useEffect(() => {
        const svg = svgRef.current;

        if (svg) {
            const element = svg.querySelector(`[data-id="${activeElement.key_liter_id}"]`);
            if (element) {
                element.classList.add('active');
            }
        }
    }, []);

    useEffect(() => {
        const loadFloor = async () => {
            const floors = await loadFloors(activeElement.key_liter_id, activeElement.floor);
            setFloors(floors);
        };

        if (activeElement) {
            loadFloor();
        }
    }, [activeElement]);

    const loadFloors = async (buildingId, floor) => {
        switch (buildingId) {
            default:
                return [];
        }
    };

    return (
        <div className="scheme">
            <div className="scheme__row">
                <div className="scheme__column">
                    <Suspense fallback={<LoadingSpinner />}>
                        <FloorMap
                            floors={floors}
                            selectedRoomData={{
                                id: activeElement.id,
                                code: activeElement.kode_text,
                                complex: activeElement.complex_id,
                            }}
                        />
                    </Suspense>
                </div>
                <div className="scheme__column">
                    <Territory ref={svgRef} />
                </div>
            </div>
        </div>
    );
};

export default Scheme;
