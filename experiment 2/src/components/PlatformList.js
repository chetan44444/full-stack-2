import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPlatforms,
  selectAllPlatforms,
  selectPlatformsStatus,
  selectPlatformsError,
} from "../features/platforms/platformsSlice";

export default function PlatformList() {
  const dispatch = useDispatch();
  const platforms = useSelector(selectAllPlatforms);
  const status = useSelector(selectPlatformsStatus);
  const error = useSelector(selectPlatformsError);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchPlatforms());
    }
  }, [status, dispatch]);

  return (
    <section className="card">
      <h2>Platforms</h2>
      {status === "loading" && <p>Loading platforms...</p>}
      {status === "failed" && <p className="error">Error: {error}</p>}
      {status === "succeeded" && (
        <ul className="platform-list">
          {platforms.map((platform) => (
            <li key={platform.id} className="platform-pill">
              {platform.name}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
