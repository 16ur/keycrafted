import React from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 14,
  },
  header: {
    fontSize: 17,
    fontWeight: "bold",
    textAlign: "left",
  },
  companyInfo: {
    marginTop: -12,
    marginBottom: 20,
    textAlign: "right",
    fontSize: 14,
  },
  clientInfo: {
    marginBottom: 20,
    lineHeight: 1.1,
  },
  table: {
    display: "table",
    width: "100%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#ccc",
    marginTop: 20,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableHeader: {
    backgroundColor: "#f2f2f2",
    fontWeight: "bold",
  },
  tableCell: {
    padding: 5,
    fontSize: 12,
    borderRightWidth: 1,
    borderRightColor: "#ccc",
    textAlign: "center",
  },
  tableCellDescription: {
    width: "50%",
    padding: 5,
    fontSize: 12,
    borderRightWidth: 1,
    borderRightColor: "#ccc",
    textAlign: "left",
  },
  tableCellQuantity: {
    width: "15%",
    padding: 5,
    fontSize: 12,
    borderRightWidth: 1,
    borderRightColor: "#ccc",
    textAlign: "center",
  },
  tableCellPrice: {
    width: "20%",
    padding: 5,
    fontSize: 12,
    borderRightWidth: 1,
    borderRightColor: "#ccc",
    textAlign: "right",
  },
  tableCellTotal: {
    width: "20%",
    padding: 5,
    fontSize: 12,
    textAlign: "right",
  },
  tableCellLast: {
    borderRightWidth: 0,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
    fontWeight: "bold",
  },
  totalLabel: {
    marginRight: 10,
    fontSize: 14,
  },
  totalValue: {
    fontSize: 14,
  },
  companyTitle: {
    color: "#2c666e",
    fontWeight: 900,
  },
});

const InvoiceDocument = ({ orderDetails }) => {
  const { items, total, fullName, address, phoneNumber, _id } = orderDetails;

  return (
    <Document>
      <Page style={styles.page}>
        <Text style={styles.header}>Facture #{_id}</Text>

        <View style={styles.companyInfo}>
          <Text style={styles.companyTitle}>KeyCrafted</Text>
          <Text>Rue Raoul Follereau</Text>
          <Text>13200 Arles, France</Text>
        </View>

        <View style={styles.clientInfo}>
          <Text>Facturé à :</Text>
          <Text>{fullName}</Text>
          <Text>{address}</Text>
          <Text>{phoneNumber}</Text>
        </View>

        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={styles.tableCellDescription}>Description</Text>
            <Text style={styles.tableCellQuantity}>Quantité</Text>
            <Text style={styles.tableCellPrice}>Prix unitaire (€)</Text>
            <Text style={[styles.tableCellTotal, styles.tableCellLast]}>
              Total (€)
            </Text>
          </View>

          {items.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.tableCellDescription}>
                {item.productId.name}
              </Text>
              <Text style={styles.tableCellQuantity}>{item.quantity}</Text>
              <Text style={styles.tableCellPrice}>
                {item.productId.price.toFixed(2)}
              </Text>
              <Text style={[styles.tableCellTotal, styles.tableCellLast]}>
                {(item.quantity * item.productId.price).toFixed(2)}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total : </Text>
          <Text style={styles.totalValue}>€{total.toFixed(2)}</Text>
        </View>
      </Page>
    </Document>
  );
};

export default InvoiceDocument;
