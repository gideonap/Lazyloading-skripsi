import React, { useState, useEffect } from 'react';

const KavlingLayout = ({ groundId, subGroundId, selectedKavlings, setSelectedKavlings, fetchKavlings }) => {
  const [kavlings, setKavlings] = useState([]);

  useEffect(() => {
    if (groundId && subGroundId) {
      fetchKavlings(groundId, subGroundId).then((data) => {
        console.log("Flattened kavlings:", data);
        setKavlings(data);
      }).catch(error => {
        console.error("Error fetching kavlings:", error);
        setKavlings([]);
      });
    }
  }, [groundId, subGroundId, fetchKavlings]);

  const handleKavlingSelect = (kavling) => {
    if (selectedKavlings.some((selected) => selected.id === kavling.id)) {
      setSelectedKavlings(selectedKavlings.filter((selected) => selected.id !== kavling.id));
    } else {
      setSelectedKavlings([...selectedKavlings, kavling]);
    }
  };

  // Group kavlings by 'baris'
  const groupedKavlings = kavlings.reduce((acc, kavling) => {
    acc[kavling.baris] = acc[kavling.baris] || [];
    acc[kavling.baris].push(kavling);
    return acc;
  }, {});

  return (
    <div className="flex flex-col gap-3 items-center w-full rounded-md border-[1.5px] px-10 py-7 border-inactive-gray-2">
      {Object.keys(groupedKavlings).length > 0 ? (
        Object.entries(groupedKavlings).map(([baris, kavlingRow]) => (
          <div key={baris} className="flex gap-2">
            {kavlingRow.sort((a, b) => a.kolom - b.kolom).map((kavling, kavlingIndex) => (
              <div
                key={kavlingIndex}
                className={`flex items-center justify-center w-12 h-12 cursor-pointer rounded-lg ${
                  kavling.isAvailable
                    ? selectedKavlings.some((selected) => selected.id === kavling.id)
                      ? 'bg-green-500'
                      : 'bg-accent-2'
                    : 'bg-red-500'
                } text-secondary`}
                onClick={() => kavling.isAvailable && handleKavlingSelect(kavling)}
              >
                <span className="text-xs font-semibold">{`${kavling.ground}${kavling.nomorGround}.${kavling.nomorKavling}`}</span>
              </div>
            ))}
          </div>
        ))
      ) : (
        <p className="text-red-500">No kavlings available or failed to load.</p>
      )}
    </div>
  );
};

export default KavlingLayout;
