import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import { ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";



const Order = () => {
  const [jadwal, setJadwal] = useState([]);
  const [filteredJadwal, setFilteredJadwal] = useState([]);
  const [kotaAsal, setKotaAsal] = useState("");
  const [kotaTujuan, setKotaTujuan] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [email, setEmail] = useState("");
  const [nama, setNama] = useState("");
  const [noTelp, setNoTelp] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [jadwalTerpilih, setJadwalTerpilih] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const [kotaAsalList, setKotaAsalList] = useState([]);
  const [kotaTujuanList, setKotaTujuanList] = useState([]);
  const [jumlahTiket, setJumlahTiket] = useState(0);
  const [harga, setHarga] = useState(0);
  const navigate = useNavigation();

  useEffect(() => {
    fetchEmailFromStorage();
    fetchData();
    const interval = setInterval(fetchData, 1000);

    // Membersihkan interval saat komponen unmount
    return () => clearInterval(interval);
  }, []);

  const fetchEmailFromStorage = async () => {
    try {
      const storedUserData = await AsyncStorage.getItem("userData");
      if (storedUserData) {
        const parsedUserData = JSON.parse(storedUserData);
        setEmail(parsedUserData.data.email);
      }
    } catch (error) {
      console.log("Error retrieving email from local storage:", error);
    }
  };
  const calculateTotalPrice = (price, quantity) => {
    return price * quantity;
  };
  const fetchData = async () => {
    try {
      const response = await axios.get("http://192.168.164.188:3003/jadwal");
      const currentDate = new Date();
  
      const filteredData = response.data.filter((item) => {
        const jadwalDate = new Date(item.hari);
        const jadwalTime = parseTime(item.jam);
  
        // Periksa apakah tanggal jadwal lebih kecil dari tanggal saat ini
        if (jadwalDate < currentDate) {
          return false;
        }
  
        // Periksa apakah tanggal jadwal sama dengan tanggal saat ini
        if (
          jadwalDate.getDate() === currentDate.getDate() &&
          jadwalDate.getMonth() === currentDate.getMonth() &&
          jadwalDate.getFullYear() === currentDate.getFullYear()
        ) {
          // Ambil jam dan menit dari tanggal jadwal
          const jadwalHours = jadwalTime.getHours();
          const jadwalMinutes = jadwalTime.getMinutes();
  
          // Ambil jam dan menit dari tanggal saat ini
          const currentHours = currentDate.getHours();
          const currentMinutes = currentDate.getMinutes();
  
          // Periksa apakah jam jadwal lebih kecil dari jam saat ini
          if (jadwalHours < currentHours) {
            return false;
          }
  
          // Periksa apakah jam jadwal sama dengan jam saat ini dan menit jadwal lebih kecil atau sama dengan menit saat ini
          if (jadwalHours === currentHours && jadwalMinutes <= currentMinutes) {
            return false;
          }
        }
  
        return true;
      });
  
      setJadwal(filteredData);
  
      const allKotaList = [];
  
      filteredData.forEach((item) => {
        if (!allKotaList.includes(item.kota_asal)) {
          allKotaList.push(item.kota_asal);
        }
        if (!allKotaList.includes(item.kota_tujuan)) {
          allKotaList.push(item.kota_tujuan);
        }
      });
  
      setKotaAsalList(allKotaList);
      setKotaTujuanList(allKotaList);
    } catch (error) {
      console.error(error);
    }
  };
  
  const parseTime = (timeStr) => {
    const [hours, minutes, seconds] = timeStr.split(":");
    const currentDate = new Date();
    currentDate.setHours(hours, minutes, seconds, 0);
    return currentDate;
  };
  

  const handleSearch = () => {
    setIsSearching(true);
    const filteredData = jadwal.filter(
      (item) =>
        item.kota_asal.toLowerCase() === kotaAsal.toLowerCase() &&
        item.kota_tujuan.toLowerCase() === kotaTujuan.toLowerCase()
    );
    setFilteredJadwal(filteredData);
    setShowForm(false);
    setJadwalTerpilih(null);
  };

  const formatTime = (timeString) => {
    const options = { hour: "numeric", minute: "numeric" };
    return new Date(`1970-01-01T${timeString}`).toLocaleTimeString(
      undefined,
      options
    );
  };

  const handlePesan = (item) => {
    setShowForm(true);
    setJadwalTerpilih(item);
    setSuccessMessage("");
    setIsOrderPlaced(false);
    setHarga(item.harga); // Set the price based on the selected jadwal item
  };
  const handlePesanSekarang = async () => {
    if (
      !jadwalTerpilih ||
      !email ||
      !nama ||
      !noTelp ||
      jumlahTiket < 1 ||
      jumlahTiket > 5
    ) {
      console.log(
        "Please fill in all fields and choose a valid ticket quantity (1-5)"
      );
      return;
    }

    const orderData = {
      jadwalId: jadwalTerpilih.hari,
      email,
      nama,
      jam: jadwalTerpilih.jam,
      harga: calculateTotalPrice(jadwalTerpilih.harga, jumlahTiket),
      status: "1",
      noTelp: noTelp.replace(/\D/g, ""),
    };

    console.log("Order data:", orderData);

    try {
      navigate.navigate("Pembayaran", { orderData });
    } catch (error) {}
  };

  const renderJadwalItem = ({ item }) => {
    const formattedHari = new Date(item.hari).toLocaleDateString("id-ID");
    const formattedJam = formatTime(item.jam);
    const formattedHarga = item.harga.toLocaleString("id-ID", {
      style: "currency",
      currency: "IDR",
    });

    return (
      <View style={styles.jadwalItemContainer}>
        <Text style={styles.jadwalItemText}>Kota Asal: {item.kota_asal}</Text>
        <Text style={styles.jadwalItemText}>
          Kota Tujuan: {item.kota_tujuan}
        </Text>
        <Text style={styles.jadwalItemText}>Tanggal: {formattedHari}</Text>
        <Text style={styles.jadwalItemText}>Jam: {formattedJam}</Text>
        <Text style={styles.jadwalItemText}>Harga: {formattedHarga}</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => handlePesan(item)}
        >
          <Text style={styles.buttonText}>Pesan</Text>
        </TouchableOpacity>
        <View style={styles.separator} />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pesan Tiket</Text>
      <View style={styles.searchContainer}>
        <Picker
          selectedValue={kotaAsal}
          style={styles.picker}
          onValueChange={(itemValue) => setKotaAsal(itemValue)}
        >
          <Picker.Item label="Pilih Kota Asal" value="" />
          {kotaAsalList.map((kota, index) => (
            <Picker.Item label={kota} value={kota} key={index} />
          ))}
        </Picker>
        <Picker
          selectedValue={kotaTujuan}
          style={styles.picker}
          onValueChange={(itemValue) => setKotaTujuan(itemValue)}
        >
          <Picker.Item label="Pilih Kota Tujuan" value="" />
          {kotaTujuanList.map((kota, index) => (
            <Picker.Item label={kota} value={kota} key={index} />
          ))}
        </Picker>
        <Picker
          selectedValue={jumlahTiket}
          style={styles.picker}
          onValueChange={(itemValue) => setJumlahTiket(itemValue)}
        >
          <Picker.Item label="Pilih Jumlah Tiket" value={0} />
          <Picker.Item label=" 1 " value={1} />
          <Picker.Item label=" 2 " value={2} />
          <Picker.Item label=" 3 " value={3} />
          <Picker.Item label=" 4 " value={4} />
          <Picker.Item label=" 5 " value={5} />
        </Picker>

        <Button
          title="Cari"
          onPress={handleSearch}
          style={styles.buttoncari}
          disabled={!kotaAsal || !kotaTujuan || jumlahTiket === 0}
          color="green"
        />
      </View>

      {isSearching && filteredJadwal.length === 0 ? (
        <Text style={styles.noDataText}>Tidak ada jadwal yang ditemukan</Text>
      ) : (
        <>
          {!showForm && (
            <FlatList
              data={filteredJadwal}
              renderItem={renderJadwalItem}
              keyExtractor={(item) => item.id.toString()}
              style={styles.listContainer}
            />
          )}
          {jadwalTerpilih && email !== "" && (
            <ScrollView>
              <View style={styles.pesanForm}>
                <Text style={styles.formTitle}>Data Pembeli</Text>
                <View style={styles.formRow}>
                  <Text style={styles.label}>Tanggal:</Text>
                  <Text style={styles.value}>
                    {new Date(jadwalTerpilih.hari).toLocaleDateString("id-ID")}
                  </Text>
                </View>
                <View style={styles.formRow}>
                  <Text style={styles.label}>Jam:</Text>
                  <Text style={styles.value}>
                    {formatTime(jadwalTerpilih.jam)}
                  </Text>
                </View>
                <View style={styles.formRow}>
                  <Text style={styles.label}>Harga:</Text>
                  <Text style={styles.value}>
                    {calculateTotalPrice(
                      jadwalTerpilih.harga,
                      jumlahTiket
                    ).toLocaleString("id-ID", {
                      style: "currency",
                      currency: "IDR",
                    })}
                  </Text>
                </View>

                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  value={email}
                  editable={false}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Nama"
                  value={nama}
                  onChangeText={(text) => setNama(text)}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Nomor Telepon"
                  value={noTelp}
                  onChangeText={(text) => setNoTelp(text)}
                  keyboardType="numeric"
                />
                <Button
                  title="Pesan Sekarang"
                  onPress={handlePesanSekarang}
                  disabled={
                    !jadwalTerpilih ||
                    !email ||
                    !nama ||
                    !noTelp ||
                    isOrderPlaced
                  }
                  color="green"
                />
                {successMessage !== "" && (
                  <Text style={styles.successMessage}>{successMessage}</Text>
                )}
              </View>
            </ScrollView>
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  buttoncari: {
    backgroundColor: "green",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  searchContainer: {
    marginBottom: 20,
  },
  picker: {
    height: 40,
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  separator: {
    height: 1,
    backgroundColor: "gray",
    marginVertical: 10,
  },
  listContainer: {
    marginBottom: 20,
  },
  noDataText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 60,
    color: "red",
  },
  button: {
    backgroundColor: "green",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 15,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  pesanForm: {
    marginTop: 20,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  formRow: {
    flexDirection: "row",
    marginBottom: 5,
  },
  label: {
    flex: 1,
    fontWeight: "bold",
  },
  value: {
    flex: 2,
  },
  successMessage: {
    fontSize: 16,
    fontWeight: "bold",
    color: "green",
    marginTop: 10,
    textAlign: "center",
  },
  jadwalItemContainer: {
    backgroundColor: "#f7f7f7",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    marginTop: 20,
  },
  jadwalItemText: {
    fontSize: 16,
    marginBottom: 5,
  },
});

export default Order;