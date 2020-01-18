import { IAppInstance, AppStatus } from "../../../shared/pm2";
import InstancePanel from "./InstancePanel";

const bytesInMb = 1024**2;
export default function(props) {
  const apps = props.apps as IAppInstance[];
  return (
    <div className="container">
      <style>{`
        tr { display: flex; }
        tr > th, td { flex: 1; text-align: center!important; }
        .is-online > th { border-color: #48c774!important; }
        .is-offline > th { border-color: #f14668!important; }
        .auto-overflow > th, td { overflow: auto;  }
      `}</style>
      {apps.map((app, index) => <InstancePanel key={`${app.pid}_${index}`} app={app} />)}
    </div>
  );
};