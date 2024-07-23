import React, { useState, useEffect, useRef, Suspense } from 'react';
import LoadingSpinner from '../includes/LoadingSpinner';
import Territory from '../includes/maps/Territory';
import FloorMap from '../includes/maps/FloorMap';

const Scheme = ({ buildings = [], selectedElement = null }) => {
    const [elements, setElements] = useState([]);
    const [selectedBuilding, setSelectedBuilding] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [floors, setFloors] = useState([]);
    const [buildingData, setBuildingData] = useState(null);
    const svgRef = useRef(null);

    const activeElements = buildings.map(item => item.key_liter_id);

    useEffect(() => {
        const svg = svgRef.current;

        if (svg) {
            const els = svg.querySelectorAll('[data-id]');
            setElements(els);
        }
    }, []);

    useEffect(() => {
        elements.forEach((element) => {
            const id = parseInt(element.dataset.id);

            if (!isNaN(id) && activeElements.includes(id)) {
                if (selectedElement && selectedElement == id) {
                    element.classList.add('selected');
                } else {
                    element.classList.remove('selected');
                }
                element.classList.add('active');
                element.addEventListener('click', handleClick);
            } else {
                element.classList.remove('active');
                element.removeEventListener('click', handleClick);
            }
        });

        return () => {
            elements.forEach((element) => {
                element.removeEventListener('click', handleClick);
            });
        };
    }, [elements, activeElements, selectedElement]);

    useEffect(() => {
        setBuildingData(buildings.find((el) => el.key_liter_id == selectedBuilding))
    }, [selectedBuilding]);

    const handleClick = async (event) => {
        const { dataset } = event.target;
        if (dataset.id) {
            setSelectedBuilding(dataset.id);
            setShowModal(true);
            const floors = await loadFloors(dataset.id);
            setFloors(floors);
        }
    };

    const loadFloors = async (buildingId) => {
        switch (buildingId) {
            default:
                return [];
        }
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedBuilding(null);
    };

    return (
        <div className="scheme">
            <Territory ref={svgRef} />
            {showModal && selectedBuilding && (
                <div className="scheme__popup">
                    <div className="flex flex--sb flex--center">
                        <div className="scheme__title">Литер <span className="scheme__title--large">{buildingData.key_liter}</span></div>
                        <button className="scheme__close button button--close" onClick={closeModal}></button>
                    </div>
                    {floors.length > 0 ? (
                        <Suspense fallback={<LoadingSpinner />}>
                            <FloorMap floors={floors} controls={true} buildingId={buildingData.key_liter_id} />
                        </Suspense>
                    ) : (
                        <div className="scheme__disclaimer">План этажей будет добавлен в скором времени.<br /> Приносим извинения за доставленные неудобства.</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Scheme;
