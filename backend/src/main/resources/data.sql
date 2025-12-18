-- Initial Data for ASKİ Water Outage Notification System
-- Ankara Districts and Sample Neighborhoods

-- Districts
INSERT INTO districts (id, name, code) VALUES (1, 'Altındağ', 'ALTINDAG');
INSERT INTO districts (id, name, code) VALUES (2, 'Çankaya', 'CANKAYA');
INSERT INTO districts (id, name, code) VALUES (3, 'Etimesgut', 'ETIMESGUT');
INSERT INTO districts (id, name, code) VALUES (4, 'Keçiören', 'KECIOREN');
INSERT INTO districts (id, name, code) VALUES (5, 'Mamak', 'MAMAK');
INSERT INTO districts (id, name, code) VALUES (6, 'Sincan', 'SINCAN');
INSERT INTO districts (id, name, code) VALUES (7, 'Yenimahalle', 'YENIMAHALLE');
INSERT INTO districts (id, name, code) VALUES (8, 'Pursaklar', 'PURSAKLAR');
INSERT INTO districts (id, name, code) VALUES (9, 'Gölbaşı', 'GOLBASI');
INSERT INTO districts (id, name, code) VALUES (10, 'Polatlı', 'POLATLI');

-- Sample Neighborhoods for Çankaya
INSERT INTO neighborhoods (id, name, district_id) VALUES (1, 'Bahçelievler', 2);
INSERT INTO neighborhoods (id, name, district_id) VALUES (2, 'Emek', 2);
INSERT INTO neighborhoods (id, name, district_id) VALUES (3, 'Gaziosmanpaşa', 2);
INSERT INTO neighborhoods (id, name, district_id) VALUES (4, 'Kavaklıdere', 2);
INSERT INTO neighborhoods (id, name, district_id) VALUES (5, 'Kızılay', 2);
INSERT INTO neighborhoods (id, name, district_id) VALUES (6, 'Çukurambar', 2);
INSERT INTO neighborhoods (id, name, district_id) VALUES (7, 'Oran', 2);
INSERT INTO neighborhoods (id, name, district_id) VALUES (8, 'Balgat', 2);

-- Sample Neighborhoods for Keçiören
INSERT INTO neighborhoods (id, name, district_id) VALUES (9, 'Etlik', 4);
INSERT INTO neighborhoods (id, name, district_id) VALUES (10, 'Subayevleri', 4);
INSERT INTO neighborhoods (id, name, district_id) VALUES (11, 'Atapark', 4);
INSERT INTO neighborhoods (id, name, district_id) VALUES (12, 'Ovacık', 4);
INSERT INTO neighborhoods (id, name, district_id) VALUES (13, 'Kalaba', 4);

-- Sample Neighborhoods for Yenimahalle
INSERT INTO neighborhoods (id, name, district_id) VALUES (14, 'Batıkent', 7);
INSERT INTO neighborhoods (id, name, district_id) VALUES (15, 'Demetevler', 7);
INSERT INTO neighborhoods (id, name, district_id) VALUES (16, 'Şentepe', 7);
INSERT INTO neighborhoods (id, name, district_id) VALUES (17, 'Ostim', 7);

-- Sample Neighborhoods for Etimesgut
INSERT INTO neighborhoods (id, name, district_id) VALUES (18, 'Eryaman', 3);
INSERT INTO neighborhoods (id, name, district_id) VALUES (19, 'Elvankent', 3);
INSERT INTO neighborhoods (id, name, district_id) VALUES (20, 'Bağlıca', 3);

-- Sample Neighborhoods for Sincan
INSERT INTO neighborhoods (id, name, district_id) VALUES (21, 'Fatih', 6);
INSERT INTO neighborhoods (id, name, district_id) VALUES (22, 'Atatürk', 6);
INSERT INTO neighborhoods (id, name, district_id) VALUES (23, 'Tandoğan', 6);

-- Sample Neighborhoods for Mamak
INSERT INTO neighborhoods (id, name, district_id) VALUES (24, 'Natoyolu', 5);
INSERT INTO neighborhoods (id, name, district_id) VALUES (25, 'Şirintepe', 5);
INSERT INTO neighborhoods (id, name, district_id) VALUES (26, 'Abidinpaşa', 5);
