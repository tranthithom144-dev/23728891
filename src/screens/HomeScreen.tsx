import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Image,
  Switch,
  Modal,
  Alert,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { STUDENT, BANNER_IMAGE_ID, FLASH_SECONDS, VARIANT, examStamp } from '@constants/student';
import { useTheme } from '@contexts/ThemeContext';
import { useCountdown } from '@hooks/useCountdown';
import { fetchProducts, Product, CategoryId } from '@services/productApi';
import { Typography } from '@components/ui/Typography';
import { ShopInput } from '@components/ui/ShopInput';
import { ShopButton } from '@components/ui/ShopButton';

export default function HomeScreen() {
  const { colors, theme, toggleTheme } = useTheme();
  const { formatted: flashTime, timeLeft } = useCountdown(FLASH_SECONDS);

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('all');

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);

  const loadData = async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await fetchProducts();
      setProducts(data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter(item => {
      const matchName = item.title.toLowerCase().includes(search.toLowerCase());
      const matchCat = selectedCategory === 'all' || item.category === selectedCategory;
      return matchName && matchCat;
    });
  }, [products, search, selectedCategory]);

  const chips = useMemo(() => {
    const list = [
      { id: 'all' as CategoryId, label: 'Tất cả' },
      { id: 'food' as CategoryId, label: 'Đồ ăn' },
      { id: 'drink' as CategoryId, label: 'Nước' },
      { id: 'study' as CategoryId, label: 'Học tập' },
    ];
    return VARIANT.chipsReversed ? list.reverse() : list;
  }, []);

  const handleOpenModal = useCallback((item: Product) => {
    setSelectedProduct(item);
    setQuantity(1);
  }, []);

  const handleConfirmOrder = () => {
    if (!selectedProduct) return;
    Alert.alert(
      `CampusMart · ${STUDENT.mssv}`,
      `${STUDENT.hoTen} (#${examStamp()}) đã ghi nhận: ${selectedProduct.title} × ${quantity}. Nhận tại quầy KTX.`,
      [{ text: 'OK', onPress: () => { setSelectedProduct(null); setQuantity(1); } }]
    );
  };

  const stampLine = `TH1 · ${STUDENT.mssv} · ${STUDENT.hoTen} · #${examStamp()}`;

  if (loading) {
    return (
      <SafeAreaView style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Typography variant="medium" style={{ marginTop: 12 }}>Đang tải món…</Typography>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={[styles.center, { backgroundColor: colors.background }]}>
        <Typography variant="bold" color="#DC2626" style={{ marginBottom: 12 }}>
          {STUDENT.mssv} — Không tải được dữ liệu món.
        </Typography>
        <ShopButton title="Thử lại" variant="danger" onPress={loadData} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Watermark Trên */}
      {VARIANT.watermarkAtTop && (
        <View style={styles.stampHeader}>
          <Typography variant="regular" color={colors.textLight}>{stampLine}</Typography>
        </View>
      )}

      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <View style={styles.headerTop}>
          <Typography variant="header" color="#FFFFFF">CAMPUSMART</Typography>
          {VARIANT.themeControl === 'switch' ? (
            <Switch value={theme === 'dark'} onValueChange={toggleTheme} />
          ) : (
            <ShopButton title="Sáng/Tối" variant="outline" onPress={toggleTheme} style={styles.themeBtn} textStyle={{ color: '#FFFFFF', fontSize: 12 }} />
          )}
        </View>
        <View style={styles.headerBottom}>
          <Typography variant="regular" color="#FFFFFF">Tiện lợi KTX</Typography>
          <Typography variant="bold" color={colors.secondary}>Flash {flashTime}</Typography>
        </View>
      </View>

      {/* Tìm kiếm */}
      <View style={styles.searchContainer}>
        <ShopInput
          placeholder={`Tìm món, nước, đồ dùng — ${STUDENT.mssv}`}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Banner */}
      <View style={styles.bannerWrapper}>
        <Image
          source={{ uri: `https://picsum.photos/id/${BANNER_IMAGE_ID}/800/320` }}
          style={styles.bannerImage}
          resizeMode="cover"
        />
        <View style={styles.bannerOverlay}>
          <Typography variant="bold" color="#FFFFFF">Đặt nhanh · Nhận tại quầy</Typography>
          <Typography variant="regular" color="#FFFFFF">Cửa hàng tiện lợi ký túc xá 24/7</Typography>
        </View>
      </View>

      {/* Chips Phân loại */}
      <View style={styles.chipsRow}>
        {chips.map(chip => {
          const isActive = selectedCategory === chip.id;
          return (
            <ShopButton
              key={chip.id}
              title={chip.label}
              onPress={() => setSelectedCategory(chip.id)}
              style={[
                styles.chip,
                { backgroundColor: isActive ? colors.primary : colors.surface, borderColor: colors.border },
              ]}
              textStyle={{ color: isActive ? '#FFFFFF' : colors.text }}
            />
          );
        })}
      </View>

      {/* Danh sách món */}
      <FlatList
        data={filteredProducts}
        keyExtractor={item => `${STUDENT.mssv}-${item.id}`}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Image source={{ uri: item.image }} style={styles.cardImage} />
            <View style={styles.cardInfo}>
              <Typography variant="bold" numberOfLines={1}>{item.title}</Typography>
              <Typography variant="medium" color={colors.primary}>{item.displayPrice}</Typography>
              <Typography variant="regular" color={colors.textLight}>
                {item.category === 'study' ? 'Học tập' : item.category === 'drink' ? 'Nước' : 'Đồ ăn'}
              </Typography>
            </View>
            <ShopButton title="Đặt" onPress={() => handleOpenModal(item)} />
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.center}>
            <Typography variant="medium" color={colors.textLight}>Không có món phù hợp</Typography>
          </View>
        }
      />

      {/* Watermark Dưới */}
      {!VARIANT.watermarkAtTop && (
        <View style={styles.stampFooter}>
          <Typography variant="regular" color={colors.textLight}>{stampLine}</Typography>
        </View>
      )}

      {/* Modal Đặt Món */}
      <Modal
        visible={!!selectedProduct}
        transparent
        animationType={VARIANT.modalAnimation}
        onRequestClose={() => setSelectedProduct(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <Typography variant="bold" style={styles.modalStamp}>{stampLine}</Typography>
            {selectedProduct && (
              <>
                <Image source={{ uri: selectedProduct.image }} style={styles.modalImage} />
                <Typography variant="bold" style={styles.modalTitle}>{selectedProduct.title}</Typography>
                <Typography variant="medium" color={colors.primary}>{selectedProduct.displayPrice}</Typography>
                <Typography variant="regular" color={colors.textLight}>
                  Danh mục: {selectedProduct.category === 'study' ? 'Học tập' : selectedProduct.category === 'drink' ? 'Nước' : 'Đồ ăn'}
                </Typography>
                <Typography variant="regular" numberOfLines={2} style={styles.modalDesc}>
                  {selectedProduct.description}
                </Typography>

                <View style={styles.qtyRow}>
                  <ShopButton title="−" onPress={() => setQuantity(q => Math.max(1, q - 1))} style={styles.qtyBtn} />
                  <Typography variant="bold" style={styles.qtyText}>{quantity}</Typography>
                  <ShopButton title="+" onPress={() => setQuantity(q => q + 1)} style={styles.qtyBtn} />
                </View>

                <ShopButton
                  title={timeLeft <= 0 ? 'Hết giờ flash-sale' : 'Xác nhận đặt'}
                  disabled={timeLeft <= 0}
                  onPress={handleConfirmOrder}
                  style={styles.actionBtn}
                />
                <ShopButton title="Đóng" variant="outline" onPress={() => setSelectedProduct(null)} style={styles.actionBtn} />
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  stampHeader: { paddingVertical: 4, alignItems: 'center' },
  stampFooter: { paddingVertical: 4, alignItems: 'center' },
  header: { padding: 16 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  themeBtn: { height: 32, paddingHorizontal: 8 },
  searchContainer: { paddingHorizontal: 16, marginVertical: 8 },
  bannerWrapper: { marginHorizontal: 16, height: 100, borderRadius: 12, overflow: 'hidden', justifyContent: 'center', alignItems: 'center' },
  bannerImage: { ...StyleSheet.absoluteFillObject },
  bannerOverlay: { backgroundColor: 'rgba(0,0,0,0.3)', width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' },
  chipsRow: { flexDirection: 'row', justifyContent: 'space-around', paddingHorizontal: 12, marginVertical: 8 },
  chip: { height: 36, borderRadius: 18, borderWidth: 1, paddingHorizontal: 12 },
  listContainer: { paddingHorizontal: 16, paddingBottom: 20 },
  card: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 12, borderWidth: 1, marginBottom: 10 },
  cardImage: { width: 60, height: 60, borderRadius: 8, marginRight: 12 },
  cardInfo: { flex: 1, marginRight: 8 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '85%', padding: 20, borderRadius: 16, alignItems: 'center' },
  modalStamp: { fontSize: 12, marginBottom: 10 },
  modalImage: { width: 120, height: 120, borderRadius: 12, marginBottom: 12 },
  modalTitle: { textAlign: 'center', marginBottom: 4 },
  modalDesc: { textAlign: 'center', marginVertical: 8 },
  qtyRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 12 },
  qtyBtn: { width: 40, height: 40 },
  qtyText: { marginHorizontal: 20, fontSize: 18 },
  actionBtn: { width: '100%', marginVertical: 6 },
});
