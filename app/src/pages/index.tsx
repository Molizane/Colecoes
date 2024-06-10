import { useEffect, useState } from "react";
import { Calendar } from "react-multi-date-picker";
import gregorian_pt_br from "react-date-object/locales/gregorian_pt_br";
import styles from "../styles/Home.module.scss";
import { Row } from "react-bootstrap";

const Home = () => {
  const [date, setDate] = useState(new Date());
  const [days, setDays] = useState([{ dia: 0, status: "" }]);

  const handleDayChanged = (e: any) => {
    setDate(e);
  };

  const handleMonthChanged = (e: any) => {
    //setDate(e);
  };

  useEffect(() => {
    //console.log('page_load');
    // Título da aba
    // document.title = `Contas ${process.env.NEXT_PUBLIC_VERSION} - Painel de Movimentação`;
    document.title = "Painel de Movimentação";
  }, []);

  useEffect(() => {
    //
  }, [date]);

  const mesAtual = new Date().getMonth();

  return (
    <div className={styles.container}>
      <Row className="m-0">
        <div className="col-12">
          <div className={styles.titulo}>
            <div className={styles.titulo2}>
              <h4>Painel de Movimentação</h4>
            </div>
          </div>
          <hr />
        </div>
        <div className="col-4">
          <Calendar
            locale={gregorian_pt_br}
            onChange={handleDayChanged}
            onMonthChange={handleMonthChanged}
            // value={date}
            mapDays={({ date }) => {
              var estilo = "";
              const refDia = days.find((d) => d.dia == date.date);

              if (refDia && refDia.status) {
                if (date.getValue("M") == mesAtual) {
                  estilo = styles.vencendo;
                } else {
                  estilo = styles.vencido;
                }
              }

              return {
                children: (
                  <div className={styles.diaCalendario}>
                    <div className={`${estilo}`}>{date.format("D")}</div>
                  </div>
                ),
              };
            }}
          />
        </div>
      </Row>
    </div>
  );
};

export default Home;
