import { useEffect, useState } from "react";
import Topbar from "../components/Topbar";
import HBar from "../components/HBar";
import { getCustomers, getPipeline } from "../api";

export default function Analytics() {
  const [repData,     setRepData]     = useState([]);
  const [channelData, setChannelData] = useState([]);
  const [stageData,   setStageData]   = useState([]);
  const [ltvData,     setLtvData]     = useState([]);

  useEffect(() => {
    Promise.all([getCustomers(), getPipeline()]).then(([customers, pipeline]) => {

      // Avg deal size by rep
      const repMap = {};
      pipeline.forEach(d => {
        if (!repMap[d.owner]) repMap[d.owner] = { total:0, count:0 };
        repMap[d.owner].total += d.value;
        repMap[d.owner].count++;
      });
      setRepData(Object.entries(repMap)
        .map(([rep, v]) => ({ label:rep, value: Math.round(v.total/v.count), sub:`${v.count} deals` }))
        .sort((a,b) => b.value - a.value));

      // Conversion rate by channel
      const chTotal = {}, chWon = {};
      customers.forEach(c => { chTotal[c.acquisition_channel] = (chTotal[c.acquisition_channel]||0)+1; });
      pipeline.filter(d => d.stage === "Closed Won").forEach(d => {
        const c = customers.find(c => c.id === d.customer_id);
        if (c) chWon[c.acquisition_channel] = (chWon[c.acquisition_channel]||0)+1;
      });
      setChannelData(Object.keys(chTotal)
        .map(ch => ({ label:ch, value: Math.round(((chWon[ch]||0)/chTotal[ch])*100), sub:`${chWon[ch]||0} won of ${chTotal[ch]}` }))
        .sort((a,b) => b.value - a.value));

      // Pipeline by stage
      const stageMap = {};
      pipeline.forEach(d => { stageMap[d.stage] = (stageMap[d.stage]||0)+d.value; });
      setStageData(Object.entries(stageMap)
        .map(([s,v]) => ({ label:s, value:v }))
        .sort((a,b) => b.value - a.value));

      // Avg LTV by segment
      const segMap = {};
      customers.forEach(c => {
        if (!segMap[c.segment]) segMap[c.segment] = { total:0, count:0 };
        segMap[c.segment].total += c.ltv;
        segMap[c.segment].count++;
      });
      setLtvData(Object.entries(segMap)
        .map(([s,v]) => ({ label:s, value: Math.round(v.total/v.count), sub:`${v.count} customers` }))
        .sort((a,b) => b.value - a.value));
    });
  }, []);

  const loading = !repData.length;

  return (
    <>
      <Topbar title="Analytics" />
      <div className="content">
        {loading ? <div className="loading">Loading…</div> : (
          <>
            <div className="grid-2">
              <div className="card">
                <div className="card-title">Avg Deal Size by Sales Rep</div>
                <HBar data={repData} formatter={v => "$"+v.toLocaleString()} />
              </div>
              <div className="card">
                <div className="card-title">Conversion Rate by Acquisition Channel</div>
                <HBar data={channelData} formatter={v => v+"%"} />
              </div>
            </div>
            <div className="grid-2">
              <div className="card">
                <div className="card-title">Pipeline Value by Stage</div>
                <HBar data={stageData} formatter={v => "$"+(v/1000).toFixed(0)+"K"} />
              </div>
              <div className="card">
                <div className="card-title">Avg LTV by Segment</div>
                <HBar data={ltvData} formatter={v => "$"+v.toLocaleString()} />
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}